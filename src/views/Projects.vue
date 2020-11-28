<template>
    <v-container fluid class="projects">
        <v-card>
            <v-card-title>
                Projects
                <v-spacer></v-spacer>
                <v-btn
                    color="teal"
                    dark
                    fab
                    v-bind="size"
                    @click="projectDialog = true"
                >
                    <v-icon v-bind="size">mdi-plus</v-icon>
                </v-btn>

                <v-dialog
                    v-model="projectDialog"
                    scrollable
                    max-width="1000"
                >
                    <ProjectEdit
                        @close="projectDialog = false; getProjects()"
                    />
                </v-dialog>
            </v-card-title>
        </v-card>

        <template v-if="projects.length > 0">
            <v-row>
                <v-col cols="12" md="6"
                    v-for="(project, index) in projects"
                    :key="index"
                >
                    <v-card>
                        <v-card-title class="align-top">
                            {{ project.name }}
                            <v-spacer></v-spacer>
                            <div class="d-flex flex-column align-end">
                                <div>
                                    <v-btn
                                        color="indigo"
                                        dark
                                        v-bind="size"
                                        @click="scanProject(project)"
                                        :disabled="project.scanning"
                                    >
                                        Scan
                                    </v-btn>
                                </div>
                                <div class="lastscan"
                                    v-if="project.ratings.length > 0 && project.ratings[0].createdAt"
                                >
                                    Last Scan: {{ formatDate(project.ratings[0].createdAt) }}
                                </div>
                            </div>
                        </v-card-title>

                        <v-card-text
                            v-if="project.ratings.length > 0"
                        >
                            <div class="d-flex justify-space-between">
                                <h4>Reliability (Bugs)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].reliabilityRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between">
                                <h4>Maintainability (Code Smells)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].maintainabilityRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between">
                                <h4>Security (Vulnerabilities)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].securityRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between">
                                <h4>Security Review (Hotspots)</h4>
                                <v-rating
                                    :value="getRating(project.ratings[0].securityReviewRating)"
                                    color="orange"
                                    background-color="orange lighten-3"
                                ></v-rating>
                            </div>
                            <div class="d-flex justify-space-between mt-1">
                                <h4>Coverage</h4>
                                <h4>{{ project.ratings[0].coverage }}%</h4>
                            </div>
                            <div class="d-flex justify-space-between mt-3">
                                <h4>Duplications</h4>
                                <h4>{{ project.ratings[0].duplications }}%</h4>
                            </div>
                            <div class="d-flex justify-space-between mt-3">
                                <h4>Lines</h4>
                                <h4>{{ project.ratings[0].lines }}</h4>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </template>
    </v-container>
</template>

<script>
import ProjectEdit from '@/components/ProjectEdit';
import moment from 'moment';

export default {
    name: 'Projects',
    components: {
        ProjectEdit
    },
    data() {
        return {
            loading: false,
            error: null,
            projects: [],

            projectDialog: false,
        }
    },
    computed: {
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    methods: {
        async getProjects() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/projects?candidate_id=' + this.$auth.user['https://hubbedin.com/id']);
                this.projects = response.data.projects;
                console.log(this.projects);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async scanProject(project) {
            this.loading = true;
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/projects/' + project.id + '/scan');
                console.log(response);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                project.scanning = true;
            }
        },
        formatDate(date) {
            return moment(date).format("DD MMM YYYY")
        },
        getRating(rating) {
            return 6 - rating;
        }
    },
    created() {
        this.getProjects();
    },
    watch: {
        '$route': 'getProjects'
    }
}
</script>

<style scoped lang="scss">
.lastscan {
    font-size: 0.7rem !important;
    font-weight: 400 !important;
}

.align-top {
    align-items: start !important;
}
</style>