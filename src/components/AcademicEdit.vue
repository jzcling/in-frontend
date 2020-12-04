<template>
    <v-card>
        <v-card-title>
            Academic History
            <v-spacer></v-spacer>
            <v-btn
                color="teal"
                dark
                fab
                v-bind="size"
                @click="addAcademic"
            >
                <v-icon v-bind="size">mdi-plus</v-icon>
            </v-btn>
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <template v-for="(academic, index) in edit.academics">
                <v-divider :key="'div-' + index" v-if="index > 0" class="my-4"></v-divider>
                <v-row
                    :key="index"
                >
                    <v-col cols="9">
                        <v-row no-gutters>
                            <v-col cols="9">
                                <v-combobox
                                    v-model="academic.institution"
                                    :items="institutions"
                                    item-text="name"
                                    label="Institution"
                                    outlined
                                    dense
                                    hide-details="auto"
                                ></v-combobox>
                            </v-col>

                            <v-col cols="3" class="pl-2">
                                <v-text-field
                                    v-model="academic.institution.country"
                                    label="Country"
                                    outlined
                                    dense
                                    hide-details="auto"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>

                    <v-col cols="3">
                        <v-text-field
                            class="right-input"
                            v-model="academic.yearObtained"
                            label="Year Obtained"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </v-col>

                    <v-col cols="9">
                        <v-combobox
                            v-model="academic.course"
                            :items="courses"
                            item-text="name"
                            label="Course"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-combobox>
                    </v-col>

                    <v-col cols="3">
                        <v-select
                            v-model="academic.course.level"
                            label="Level"
                            :items="levels"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-select>
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
    name: 'AcademicEdit',
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
            institutions: [],
            courses: [],

            levels: ['Undergraduate', 'Master\'s', 'Doctorate', 'Diploma', 'Others']
        }
    },
    methods: {
        getData() {
            this.getInstitutions();
            this.getCourses();
        },
        async getInstitutions() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/institutions', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.institutions = response.data.institutions;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async getCourses() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/courses', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.courses = response.data.courses;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async createInstitution(institution) {
            this.loading = true;
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/institutions', {
                    name: institution.name,
                    country: institution.country
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
        async createCourse(course) {
            this.loading = true;
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/courses', {
                    level: course.level,
                    name: course.name
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
        async updateAcademics() {
            var existingInstitutions = this.institutions.map(institution => institution.name + ", " + institution.country);
            var existingCourses = this.courses.map(course => course.name + ", " + course.level);

            this.edit.academics.forEach(async academic => {
                var institution = academic.institution;
                // if institution does not exist, create it
                if (!existingInstitutions.includes(institution.name + ", " + institution.country)) {
                    var inResponse = await this.createInstitution(institution);
                    institution = inResponse.data;
                }

                var course = academic.course;
                // if course does not exist, create it
                if (!course.id && !existingCourses.includes(course.name + ", " + course.level)) {
                    var crResponse = await this.createCourse(course);
                    course = crResponse.data;
                }

                // create academic history if not in current history
                if (!this.candidate.academics.includes(academic)) {
                    this.createAcademic(academic);
                }
            });

            // delete all academic histories that have been removed
            this.candidate.academics.forEach(academic => {
                if (!this.edit.academics.includes(academic)) {
                    this.deleteAcademic(academic);
                }
            });
        },
        async createAcademic(academic) {
            this.loading = true;
            try {
                await this.$axios.post(this.$apiBase + '/v1/academichistories', {
                    candidateId: this.candidate.id,
                    institutionId: academic.institution.id,
                    courseId: academic.course.id,
                    yearObtained: academic.yearObtained
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
        async deleteAcademic(academic) {
            this.loading = true;
            try {
                await this.$axios.delete(this.$apiBase + '/v1/academichistories/' + academic.id, {
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
            try {
                await this.updateAcademics();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
        addAcademic() {
            this.edit.academics = this.edit.academics || [];
            this.edit.academics.push({
                candidateId: this.candidate.id,
                institution: {
                    id: null,
                    name: null,
                    country: null
                },
                course: {
                    id: null,
                    name: null,
                    level: null
                },
                yearObtained: null
            });
        }
    },
    created() {
        this.getData();
        // create deep copy of candidate
        this.edit = JSON.parse(JSON.stringify(this.candidate));
    },
}
</script>

<style scoped lang="scss">
.right-input >>> input {
    text-align: right !important;
}
</style>