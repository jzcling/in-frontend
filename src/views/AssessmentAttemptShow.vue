<template>
    <v-container fluid class="assessmentattemptshow" v-if="attempt">
        <template v-if="attempt.status == 'In Progress'">
            <v-navigation-drawer app>
                <v-list-item class="my-2">
                    <v-list-item-content>
                        <v-list-item-title class="d-flex justify-center">
                            <v-img
                                alt="Assessment Image"
                                class="shrink mr-2"
                                contain
                                :src="attempt.assessment.imageUrl"
                                transition="scale-transition"
                                width="150"
                            />
                        </v-list-item-title>
                        <v-list-item-subtitle class="d-flex justify-center">
                            {{ attempt.assessment.name }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list
                    dense
                    nav
                >
                    <v-list-item
                        v-for="(question, index) in attempt.questions"
                        :key="index"
                        @click="selectQuestion(index)"
                        :input-value="index == (qIndex - 1)"
                    >
                        <v-list-item-title>Question {{ index + 1 }}</v-list-item-title>
                        
                        <v-list-item-icon>
                            <v-icon 
                                :color="getQuestionIndicator(question)"
                                small
                            >mdi-circle</v-icon>
                        </v-list-item-icon>
                    </v-list-item>
                </v-list>

                <template v-slot:append>
                    <div class="pa-2 ma-2">
                        <v-btn
                            color="primary" 
                            block
                            @click="endDialog = true"
                        >
                            End Assessment
                        </v-btn>
                    </div>
                </template>
            </v-navigation-drawer>

            <v-card v-if="question" class="px-4 py-2">
                <v-card-title>
                    Question {{ qIndex }}
                </v-card-title>

                <v-card-subtitle>
                    <div class="black--text"> {{ question.text }}</div>
                </v-card-subtitle>

                <v-img
                    v-if="question.imageUrl"
                    contain
                    :src="question.imageUrl"
                ></v-img>

                <v-card-text>
                    <template v-if="question.options.length > 0">
                        <v-radio-group 
                            v-model="qAttempt.selection"
                            column
                        >
                            <v-radio
                                v-for="(option, index) in question.options"
                                :key="index"
                                :value="index"
                                :label="option"
                                class="black--text"
                            ></v-radio>
                        </v-radio-group>
                    </template>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        class="px-4"
                        v-if="qIndex > 1"
                        color="indigo"
                        dark
                        @click="selectQuestion(qIndex - 2)"
                    >Back</v-btn>
                    <v-btn
                        class="px-4"
                        v-if="qIndex < attempt.questions.length"
                        color="indigo"
                        dark
                        @click="selectQuestion(qIndex)"
                    >Next</v-btn>
                    <v-btn
                        class="px-4"
                        v-if="qIndex == attempt.questions.length"
                        color="teal"
                        dark
                        @click="endDialog = true"
                    >Finish</v-btn>
                </v-card-actions>
            </v-card>
        </template>

        <template v-else>
            <v-card>
                <v-card-title>
                    Assessment has been completed.
                </v-card-title>

                <v-card-subtitle>
                    Thank you for your time! This assessment has either been completed or has expired. Please contact HubbedIn if this is an error.
                </v-card-subtitle>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="teal"
                        dark
                        @click="redirectToAssessments"
                    >Back To Assessments</v-btn>
                </v-card-actions>
            </v-card>
        </template>

        <v-dialog
            v-model="endDialog"
            max-width="400"
        >
            <v-card>
                <v-card-title>
                    End Assessment?
                </v-card-title>
                <v-card-text>
                    Are you sure you want to end the assessment?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                        color="error"
                        @click="endDialog = false"
                    >No</v-btn>
                    <v-btn
                        color="teal"
                        dark
                        @click="endAssessment"
                    >Yes</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
export default {
    name: 'AssessmentAttemptShow',
    props: {
        id: {
            required: true,
            type: String
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            attempt: null,
            question: null,
            qIndex: 1,

            endDialog: false,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        qAttempt() {
            return this.attempt.questionAttempts.find(attempt => attempt.questionId == this.question.id);
        }
    },
    methods: {
        async getAssessmentAttempt() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/assessmentattempts/' + this.id, this.axiosConfig);
                this.attempt = response.data;
                console.log(this.attempt);
                if (this.attempt.questions.length > 0) {
                    this.question = this.attempt.questions[0];
                }
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        async updateAssessmentAttempt(data) {
            this.loading = true;
            try {
                var response = await this.$axios.put(this.$apiBase + '/v1/assessmentattempts/' + this.id, data, this.axiosConfig);
                this.attempt = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async updateAttemptQuestion() {
            this.loading = true;
            try {
                await this.$axios.put(this.$apiBase + '/v1/attemptquestions/' + this.qAttempt.id, this.qAttempt, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        selectQuestion(index) {
            this.updateAttemptQuestion();
            this.question = this.attempt.questions[index];
            this.qIndex = index + 1;
        },
        getQuestionIndicator(question) {
            let attempt = this.attempt.questionAttempts.find(attempt => attempt.questionId == question.id);
            if (attempt && (attempt.selection != null || attempt.text != null)) {
                return 'green';
            }
            return 'red';
        },
        async endAssessment() {
            let data = this.attempt;
            data.completedAt = new Date();
            data.status = 'Completed';
            await this.updateAssessmentAttempt(data);
        },
        redirectToAssessments() {
            this.$router.push('/assessments');
            this.$emit('open-drawer');
        }
    },
    created() {
        this.getAssessmentAttempt();
        this.$emit('close-drawer');
    },
    watch: {
        '$route': 'getAssessmentAttempt'
    }
}
</script>

<style scoped lang="scss">
.black--text ::v-deep label {
    color: black;
}
</style>