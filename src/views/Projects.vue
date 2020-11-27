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
                    @click="addProject"
                >
                    <v-icon v-bind="size">mdi-plus</v-icon>
                </v-btn>

                <v-dialog
                    v-model="projectDialog"
                    scrollable
                    max-width="1000"
                >
                    <ProfileEdit
                        @close="projectDialog = false; getProjects()"
                    />
                </v-dialog>
            </v-card-title>
        </v-card>

        <v-card
            v-for="(project, index) in projects"
            :key="index"
        >
            <v-card-title>
                {{ project.name }}
                <v-spacer></v-spacer>
                <div class="d-flex flex-column">
                    <v-btn
                        color="indigo"
                        dark
                        v-bind="size"
                        @click="scanProject(project)"
                    >
                        Scan
                    </v-btn>
                    <small
                        v-if="project.ratings[0].createdAt"
                    >
                        Last Scan: {{ moment(project.ratings[0].createdAt).format("DD MMM YYYY") }}
                    </small>
                </div>
            </v-card-title>

            <v-card-text>
                <div class="d-flex justify-space-between">
                    <h4>Reliability (Bugs)</h4>
                    <v-rating
                        v-model="project.ratings[0].reliabilityRating"
                        color="orange"
                        background-color="orange lighten-3"
                    ></v-rating>
                </div>
                <div class="d-flex justify-space-between">
                    <h4>Maintainability (Code Smells)</h4>
                    <v-rating
                        v-model="project.ratings[0].maintainabilityRating"
                        color="orange"
                        background-color="orange lighten-3"
                    ></v-rating>
                </div>
                <div class="d-flex justify-space-between">
                    <h4>Security (Vulnerabilities)</h4>
                    <v-rating
                        v-model="project.ratings[0].securityRating"
                        color="orange"
                        background-color="orange lighten-3"
                    ></v-rating>
                </div>
                <div class="d-flex justify-space-between">
                    <h4>Security Review (Hotspots)</h4>
                    <v-rating
                        v-model="project.ratings[0].securityReviewRating"
                        color="orange"
                        background-color="orange lighten-3"
                    ></v-rating>
                </div>
                <div class="d-flex justify-space-between">
                    <h4>Coverage</h4>
                    <h4>{{ project.ratings[0].coverage }}%</h4>
                </div>
                <div class="d-flex justify-space-between">
                    <h4>Duplications</h4>
                    <h4>{{ project.ratings[0].duplications }}%</h4>
                </div>
                <div class="d-flex justify-space-between">
                    <h4>Lines</h4>
                    <h4>{{ project.ratings[0].lines }}</h4>
                </div>
            </v-card-text>
        </v-card>
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
                this.projects = response.data;
                console.log(this.projects);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
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
</style>