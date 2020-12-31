<template>
    <v-container fluid class="joblistings">
        <v-row>
            <v-col cols="12" md="4">
                <v-list three-line>
                    <template v-for="(item, index) in jobs">
                        <v-divider
                            v-if="index > 0"
                            :key="'divider-'+index"
                            inset
                        ></v-divider>

                        <v-list-item
                            :key="index"
                            @click="clickJob(item)"
                        >
                            <v-list-item-avatar>
                                <v-img :src="item.company.logoUrl"></v-img>
                            </v-list-item-avatar>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                                <v-list-item-subtitle>{{ item.company.name }} • {{ item.location }}</v-list-item-subtitle>
                                <v-list-item-subtitle>{{ parseTimeAgo(item.updatedAt) }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <v-icon
                                v-if="item.remote"
                                small
                                color="red"
                                class="icon"
                            >mdi-remote</v-icon>
                        </v-list-item>
                    </template>
                </v-list>
            </v-col>

            <v-col md="8" v-if="$vuetify.breakpoint.mdAndUp">
                <Joblisting
                    v-if="selectedJob"
                    :job="selectedJob"
                ></Joblisting>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import Joblisting from '@/components/Joblisting';
import moment from 'moment';

export default {
    name: 'Joblistings',
    components: {
        Joblisting
    },
    data() {
        return {
            loading: false,
            error: null,
            jobs: null,
            selectedJob: null,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async getJobs() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/joblistings', this.axiosConfig);
                this.jobs = response.data.jobPosts;
                if (this.jobs.length > 0) {
                    this.selectedJob = this.jobs[0];
                }
                console.log(this.jobs);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
        clickJob(job) {
            if (this.$vuetify.breakpoint.mdAndUp) {
                this.selectedJob = job;
            } else {
                this.$router.push('/joblistings/' + job.id);
            }
        },
        parseTimeAgo(date) {
            return moment(date).fromNow()
        }
    },
    created() {
        this.getJobs();
    },
    watch: {
        '$route': 'getJobs'
    }
}
</script>

<style scoped lang="scss">
.icon {
    position: absolute;
    top: 8px;
    right: 8px;
}
</style>