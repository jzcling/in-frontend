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

            <v-row>
                <v-col cols="12">
                    <vue-countdown-timer
                        class="float-right"
                        :start-time="startTime"
                        :end-time="endTime"
                        :end-label="'Time Left'"
                        :end-text="'Time\'s up!'"
                        :hour-txt="'h'"
                        :minutes-txt="'m'"
                        :seconds-txt="'s'"
                        @end_callback="endAssessment"
                    >
                        <template slot="start-label" slot-scope="scope">
                            <span class="countdown-text">{{scope.props.endLabel}}:</span>
                        </template>

                        <template slot="countdown" slot-scope="scope">
                            <span class="countdown-card">{{scope.props.hours}}{{scope.props.hourTxt}}</span>
                            <span class="countdown-card">{{scope.props.minutes}}{{scope.props.minutesTxt}}</span>
                            <span class="countdown-card">{{scope.props.seconds}}{{scope.props.secondsTxt}}</span>
                        </template>

                        <template slot="end-text" slot-scope="scope">
                            <span class="countdown-card">{{scope.props.endText}}</span>
                        </template>
                    </vue-countdown-timer>
                </v-col>
            </v-row>

            <v-card v-if="question" class="px-4 py-2">
                <v-card-title>
                    Question {{ qIndex }}
                </v-card-title>

                <v-card-subtitle>
                    <div class="black--text"> {{ question.text }}</div>
                </v-card-subtitle>

                <v-img
                    v-if="qMediaType == 'image'"
                    contain
                    :src="question.mediaUrl"
                ></v-img>

                <vuetify-audio
                    v-else-if="qMediaType == 'audio'"
                    :file="question.mediaUrl"
                    color="indigo"
                    flat
                ></vuetify-audio>

                <div 
                    class="d-flex justify-center"
                    v-else-if="qMediaType == 'video'"
                >
                    <video-player
                        class="vjs-big-play-centered"
                        :options="videoPlayerOptions"
                        :playsinline="true"
                    ></video-player>
                </div>

                <v-card-text>
                    <template v-if="question.type == 'Multiple Choice' && question.options.length > 0">
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

                    <template v-else-if="question.type == 'Coding'">
                        <v-row>
                            <v-col cols="12">
                                <v-select
                                    class="float-right"
                                    v-model="qAttempt.cmMode"
                                    :items="cmModes"
                                    label="Style"
                                    outlined
                                    dense
                                    hide-details
                                ></v-select>
                            </v-col>
                            <v-col cols="12" class="code-mirror">
                                <codemirror v-model="qAttempt.text" :options="cmOptions"></codemirror>
                            </v-col>
                        </v-row>
                    </template>

                    <template v-else-if="question.type == 'Open'">
                        <v-textarea
                            v-model="qAttempt.text"
                            outlined
                            hide-details="auto"
                        ></v-textarea>
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
import { codemirror } from 'vue-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript.js'
import 'codemirror/mode/php/php.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/ruby/ruby.js'
import 'codemirror/mode/swift/swift.js'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/lua/lua.js'
import 'codemirror/mode/go/go.js'
import 'codemirror/theme/base16-dark.css'

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'

import moment from 'moment';

export default {
    name: 'AssessmentAttemptShow',
    props: {
        id: {
            required: true,
            type: String
        }
    },
    components: {
        codemirror,
        videoPlayer,
        VuetifyAudio: () => import('vuetify-audio')
    },
    data() {
        return {
            loading: false,
            error: null,
            attempt: null,
            question: null,
            qIndex: 1,

            endDialog: false,

            cmOptions: {
                mode: 'text/javascript',
                theme: 'base16-dark',
                lineNumbers: true,
                line: true,
                styleActiveLine: true,
                matchBrackets: true
            },
            cmModes: ['text/javascript', 'text/x-php', 'text/x-java', 
                'text/x-csharp', 'text/x-ruby', 'text/x-python', 
                'text/x-go', 'text/x-swift', 'text/x-c++src', 
                'text/x-lua', 'text/x-scala'],

            videoPlayerOptions: {
                language: 'en',
                playbackRates: [0.7, 1.0, 1.5, 2.0],
                sources: [{
                    type: null,
                    src: null
                }],
                width: this.$vuetify.breakpoint.mdAndUp ? '700px' : '320px'
            },
            videoMimeTypes: {
                opus: 'video/ogg',
                ogv: 'video/ogg',
                mp4: 'video/mp4',
                mov: 'video/mp4',
                m4v: 'video/mp4'
            },
            
            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        qAttempt() {
            if (this.attempt) {
                let attempt = this.attempt.questionAttempts.find(attempt => attempt.questionId == this.question.id);
                attempt.selection = Number(attempt.selection);
                return attempt;
            }
            return null;
        },
        qMediaType() {
            if (this.question) {
                if (this.question.mediaUrl.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
                    return 'image';
                }
                if (this.question.mediaUrl.match(/\.(m4a|flac|mp3|wav|aac)$/i)) {
                    return 'audio';
                }
                if (this.question.mediaUrl.match(/\.(mp4|mov|m4v|opus|ogv|mkv)$/i)) {
                    return 'video';
                }
            }
            return null
        },
        vMimeType() {
            if (this.qMediaType == 'video') {
                let url = this.question.mediaUrl;
                let ext = url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
                return this.videoMimeTypes[ext];
            }
            return null;
        },
        vSrc() {
            return this.question.mediaUrl;
        },
        startTime() {
            return moment(this.attempt.startedAt).unix();
        },
        endTime() {
            if (this.attempt.assessment.timeAllowed) {
                return moment(this.attempt.startedAt).add(this.attempt.assessment.timeAllowed, 'seconds').unix();
            }
            return null;
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
            if (attempt && (attempt.selection > -1 || attempt.text.length > 0)) {
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
        '$route': 'getAssessmentAttempt',
        'qAttempt.cmMode': {
            handler(val) {
                this.cmOptions.mode = val;
            }
        },
        qMediaType(val) {
            if (val == 'video') {
                this.videoPlayerOptions.sources[0] = {
                    type: this.vMimeType,
                    src: this.vSrc
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.black--text ::v-deep label {
    color: black;
}

.code-mirror ::v-deep .CodeMirror {
    height: auto;
}

.countdown-text {
    font-size: 1rem;
    font-weight: 500;
}
.countdown-card {
    font-size: 1.2rem;
    color: white;
    background: indianred;
    border-radius: 0.5rem;
    padding: 4px 12px 4px 12px;
    margin: 4px;

    @media only screen and (max-width: 600px) {
        font-size: 1rem;
        padding: 3px 8px 3px 8px;
        margin: 4px;
    }
}
</style>