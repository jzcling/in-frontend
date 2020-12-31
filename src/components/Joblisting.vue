<template>
    <v-card>
        <v-row class="no-gutters">
            <v-col cols="auto">
                <v-img
                    height="80px"
                    width="80px"
                    contain
                    :src="job.company.logoUrl"
                    class="ma-4"
                ></v-img>
            </v-col>

            <v-col cols="grow">
                <v-card-title>
                    {{ job.title }}    
                </v-card-title>

                <v-card-subtitle>
                    <div>{{ job.company.name }} • {{ job.location }}</div>
                    <div>{{ parseTimeAgo(job.updatedAt) }}</div>
                </v-card-subtitle>
            </v-col>
        </v-row>

        <v-chip-group column class="mx-4">
            <v-chip
                v-for="skill in job.skills"
                :key="skill.id"
                color="indigo lighten-1"
                dark
            >{{ skill.name }}</v-chip>
        </v-chip-group>
            
        <v-card-text v-html="job.description"></v-card-text>

        <v-card-text>
            <v-row>
                <v-col cols="12" md="6" v-if="salaryRange">
                    <div>Salary</div>
                    <div>{{ salaryRange }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="job.seniorityLevel">
                    <div>Seniority Level</div>
                    <div>{{ job.seniorityLevel }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="job.yearsExperience">
                    <div>Experience (Years)</div>
                    <div>{{ job.yearsExperience }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="job.employmentType">
                    <div>Employment Type</div>
                    <div>{{ job.employmentType }}</div>
                </v-col>
                
                <v-col cols="12" md="6" v-if="job.function">
                    <div>Job Function</div>
                    <div>{{ job.function.name }}</div>
                </v-col>
                
                <v-col cols="12" md="6" v-if="job.industry">
                    <div>Industry</div>
                    <div>{{ job.industry.name }}</div>
                </v-col>

                <v-col cols="12" md="6">
                    <div>Remote Position Available?</div>
                    <div>{{ job.remote ? 'Yes' : 'No' }}</div>
                </v-col>

                <v-col cols="12" md="6" v-if="job.company.size > 0">
                    <div>Company Size</div>
                    <div>{{ job.company.size }}</div>
                </v-col>
            </v-row>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="teal"
                dark
                @click="apply"
            >Apply</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
import moment from 'moment';

export default {
    name: 'Joblisting',
    props: {
        job: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            error: null,

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    computed: {
        salaryRange() {
            var range = '';
            if (this.job.salaryCurrency) {
                range += this.job.salaryCurrency + " ";
            }
            if (this.job.minSalary > 0) {
                range += this.job.minSalary;
            }
            if (this.job.maxSalary > 0) {
                if (this.job.minSalary > 0) {
                    range += ' - ' + this.job.maxSalary;
                } else {
                    range += this.job.maxSalary;
                }
            }
            return range;
        }
    },
    methods: {
        apply() {
            console.log('apply');
        },
        parseTimeAgo(date) {
            return moment(date).fromNow()
        }
    }
}
</script>

<style scoped lang="scss">
</style>