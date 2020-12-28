<template>
    <v-container fluid class="joblistings">
        <Joblisting
            :job="job"
        ></Joblisting>
    </v-container>
</template>

<script>
import Joblisting from '@/components/Joblisting';

export default {
    name: 'Joblistings',
    components: {
        Joblisting
    },
    props: {
        id: {
            required: true,
            type: [String, Number]
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            job: null,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async getJob() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/joblistings/' + this.id, this.axiosConfig);
                this.job = response.data;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
                this.$emit('cancel-loading');
            }
        },
    },
    created() {
        this.getJob();
    },
    watch: {
        '$route': 'getJob'
    }
}
</script>

<style scoped lang="scss">
</style>