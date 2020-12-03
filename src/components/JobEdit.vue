<template>
    <v-card>
        <v-card-title>
            Work Experience
            <v-spacer></v-spacer>
            <v-btn
                color="teal"
                dark
                fab
                v-bind="size"
                @click="addJob"
            >
                <v-icon v-bind="size">mdi-plus</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <template v-for="(job, index) in edit.jobs">
                <v-divider :key="'div-' + index" v-if="index > 0" class="my-4"></v-divider>
                <v-row
                    :key="index"
                >
                    <v-col cols="7">
                        <v-row no-gutters>
                            <v-col cols="6">
                                <v-combobox
                                    v-model="job.company"
                                    :items="companies"
                                    item-text="name"
                                    label="Company"
                                    outlined
                                    dense
                                    hide-details="auto"
                                ></v-combobox>
                            </v-col>

                            <v-col cols="3" class="pl-2">
                                <v-text-field
                                    v-model="job.city"
                                    label="City"
                                    outlined
                                    dense
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>

                            <v-col cols="3" class="pl-2">
                                <v-text-field
                                    v-model="job.country"
                                    label="Country"
                                    outlined
                                    dense
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="5">
                        <div class="d-flex">
                            <v-menu
                                v-model="startDateMenu[index]"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        label="Start Date"
                                        v-model="startDate[index]"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        dense
                                        hide-details="auto"
                                        clearable
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    :ref="'startpicker'+index"
                                    v-model="startDate[index]"
                                    @input="startDateMenu[index] = false"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    type="month"
                                ></v-date-picker>
                            </v-menu>

                            <v-menu
                                v-model="endDateMenu[index]"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        class="ml-2"
                                        label="End Date"
                                        v-model="endDate[index]"
                                        prepend-icon="mdi-calendar"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                        outlined
                                        dense
                                        hide-details="auto"
                                        clearable
                                    ></v-text-field>
                                </template>
                                <v-date-picker
                                    :ref="'endpicker'+index"
                                    v-model="endDate[index]"
                                    @input="endDateMenu[index] = false"
                                    :max="new Date().toISOString().substr(0, 10)"
                                    type="month"
                                ></v-date-picker>
                            </v-menu>
                        </div>
                    </v-col>

                    <v-col cols="12">
                        <v-text-field
                            v-model="job.title"
                            label="Title"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>

                        <v-combobox
                            class="mt-2"
                            v-model="job.department"
                            :items="departments"
                            item-text="name"
                            label="Department"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="12" md="6">
                        <div class="d-flex">
                            <v-text-field
                                v-model="job.salaryCurrency"
                                label="Currency"
                                outlined
                                dense
                                hide-details="auto"
                            ></v-text-field>

                            <v-text-field
                                class="ml-2"
                                v-model="job.salary"
                                label="Salary"
                                outlined
                                dense
                                hide-details="auto"
                            ></v-text-field>
                        </div>
                    </v-col>

                    <v-col cols="12">
                        <div>Description</div>
                        <v-textarea
                            v-model="job.description"
                            class="mt-1"
                            outlined
                            hide-details="auto"
                        ></v-textarea>
                    </v-col>
                </v-row>
            </template>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="error"
                @click="$emit('close')"
            >Cancel</v-btn>
            <v-btn
                color="teal"
                dark
                @click="save"
            >Save</v-btn>
        </v-card-actions>
    </v-card>
</template>

<script>
export default {
    name: 'jobEdit',
    props: {
        candidate: {
            required: true,
            type: Object
        }
    },
    computed: {
        size () {
            const size = {xs:'x-small',sm:'small'}[this.$vuetify.breakpoint.name];
            return size ? { [size]: true } : {}
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},
            companies: [],
            departments: [],

            levels: ['Undergraduate', 'Master\'s', 'Doctorate', 'Diploma', 'Others'],

            startDate: {},
            endDate: {},
            startDateMenu: {},
            endDateMenu: {},
        }
    },
    methods: {
        getData() {
            this.getCompanies();
            this.getDepartments();
        },
        async getCompanies() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/companies', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.companies = response.data.companies;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async getDepartments() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/departments', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.departments = response.data.departments;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async createCompany(company) {
            this.loading = true;
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/companies', {
                    name: company
                }, {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
            return response;
        },
        async createDepartment(department) {
            this.loading = true;
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/departments', {
                    name: department
                }, {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
            return response;
        },
        async updateJobs() {
            var existingCompanies = this.companies.map(company => company.name);
            var existingDepartments = this.departments.map(department => department.name);

            this.edit.jobs.forEach(async job => {
                var company = job.company;
                // if company does not exist, create it
                if (!company.id && !existingCompanies.includes(company.name)) {
                    var coResponse = await this.createCompany(company);
                    company = coResponse.data;
                }

                var department = job.department;
                // if department does not exist, create it
                if (!department.id && !existingDepartments.includes(department.name)) {
                    var dpResponse = await this.createDepartment(department);
                    department = dpResponse.data;
                }

                // create job history if not in current history
                if (!this.candidate.jobs.includes(job)) {
                    this.createJob(job);
                }
            });

            // delete all job histories that have been removed
            this.candidate.jobs.forEach(job => {
                if (!this.edit.jobs.includes(job)) {
                    this.deleteJob(job);
                }
            });
        },
        async createJob(job) {
            this.loading = true;

            if (job.description) {
                job.description = job.description.replace(/\n\r?/g, '<br />\n');
            }

            try {
                await this.$axios.post(this.$apiBase + '/v1/jobhistories', {
                    candidateId: this.candidate.id,
                    companyId: job.company.id,
                    departmentId: job.department.id,
                    country: job.country,
                    city: job.city,
                    title: job.title,
                    startDate: job.startDate,
                    endDate: job.endDate,
                    salaryCurrency: job.salaryCurrency,
                    salary: job.salary,
                    description: job.description
                }, {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async deleteJob(job) {
            this.loading = true;
            try {
                await this.$axios.delete(this.$apiBase + '/v1/jobhistories/' + job.id, {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async save() {
            await this.updateJobs();
            this.$emit('close')
        },
        addJob() {
            this.edit.jobs = this.edit.jobs || [];
            this.edit.jobs.push({
                candidateId: this.candidate.id
            });
        }
    },
    created() {
        this.getData();
        // create deep copy of candidate
        this.edit = JSON.parse(JSON.stringify(this.candidate));
        for (let i = 0; i < this.edit.jobs.length; i++) {
            let job = this.edit.jobs[i];
            if (job.startDate) {
                this.startDate[i] = new Date(job.startDate).toISOString().substr(0, 10);
            }
            if (job.endDate) {
                this.endDate[i] = new Date(job.endDate).toISOString().substr(0, 10);
            }
        }
    },
    watch: {
        // startDateMenu: {
        //     handler (val) {
        //         for (let i of Object.keys(val)) {
        //             val[i] && setTimeout(() => (this.$refs['startpicker'+i].activePicker = 'YEAR'));
        //         }
        //     },
        //     deep: true
        // },
        // endDateMenu: {
        //     handler (val) {
        //         for (let i of Object.keys(val)) {
        //             val[i] && setTimeout(() => (this.$refs['endpicker'+i].activePicker = 'YEAR'));
        //         }
        //     },
        //     deep: true
        // },
        startDate: {
            handler (val) {
                for (let i of Object.keys(val)) {
                    let date = val[i];
                    if (date) {
                        this.edit.jobs[i].startDate = new Date(date);
                    } else {
                        this.edit.jobs[i].startDate = null;
                    }
                }
            },
            deep: true
        },
        endDate: {
            handler (val) {
                for (let i of Object.keys(val)) {
                    let date = val[i];
                    if (date) {
                        this.edit.jobs[i].endDate = new Date(date);
                    } else {
                        this.edit.jobs[i].endDate = null;
                    }
                }
            },
            deep: true
        }
    }
}
</script>

<style scoped lang="scss">
.right-input >>> input {
    text-align: right !important;
}
</style>