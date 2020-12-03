<template>
    <v-card>
        <v-card-title>
            Profile
        </v-card-title>

        <v-card-text
            max-height="600"
        >
            <div class="d-flex flex-no-wrap align-content-space-around pa-4">
                <div class="d-flex flex-column align-center" style="width: 230px;">
                    <v-avatar size="125">
                        <v-img :src="edit.picture" alt="Profile Picture" />
                    </v-avatar>
                    <v-file-input
                        class="mt-4"
                        :rules="avatarRules"
                        accept="image/png, image/jpeg, image/bmp"
                        placeholder="Pick a profile picture"
                        prepend-icon="mdi-camera"
                        label="Picture"
                        hide-details="auto"
                        outlined
                        dense
                    ></v-file-input>
                </div>

                <div
                    v-if="$vuetify.breakpoint.mdAndUp" 
                    class="grow mx-4"
                >
                    <div class="d-flex">
                        <v-text-field
                            v-model="edit.firstName"
                            label="First Name"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.lastName"
                            class="ml-2"
                            label="Last Name"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </div>
                        
                    <div>
                        <v-text-field
                            v-model="edit.email"
                            class="mt-3"
                            label="Email"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.contactNumber"
                            class="mt-3"
                            label="Contact Number"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                        <v-text-field
                            v-model="edit.residenceCity"
                            class="mt-3"
                            label="City of Residence"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </div>
                </div>

                <div
                    v-if="$vuetify.breakpoint.mdAndUp" 
                    class="d-flex flex-column justify-space-around mr-4"
                >
                    <div
                        class="d-flex align-content-center"
                    >
                        <v-icon class="mr-2">mdi-github</v-icon>
                        <v-text-field
                            v-model="edit.scmUrl"
                            label="Github URL"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </div>
                    <div 
                        class="d-flex align-content-center"
                    >
                        <v-icon class="mr-2">mdi-linkedin</v-icon>
                        <v-text-field
                            v-model="edit.linkedInUrl"
                            label="LinkedIn URL"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </div>
                    <div 
                        class="d-flex align-content-center"
                    >
                        <v-icon class="mr-2">mdi-web</v-icon>
                        <v-text-field
                            v-model="edit.websiteUrl"
                            label="Personal Website"
                            outlined
                            dense
                            hide-details="auto"
                        ></v-text-field>
                    </div>
                </div>
            </div>

            <div
                v-if="$vuetify.breakpoint.smAndDown"
            >
                <v-text-field
                    v-model="edit.firstName"
                    label="First Name"
                    outlined
                    dense
                    hide-details="auto"
                ></v-text-field>
                <v-text-field
                    v-model="edit.lastName"
                    class="mt-3"
                    label="Last Name"
                    outlined
                    dense
                    hide-details="auto"
                ></v-text-field>
                    
                <v-text-field
                    v-model="edit.email"
                    class="mt-3"
                    label="Email"
                    outlined
                    dense
                    hide-details="auto"
                ></v-text-field>
                <v-text-field
                    v-model="edit.contactNumber"
                    class="mt-3"
                    label="Contact Number"
                    outlined
                    dense
                    hide-details="auto"
                ></v-text-field>
                <v-text-field
                    v-model="edit.residenceCity"
                    class="mt-3"
                    label="City of Residence"
                    outlined
                    dense
                    hide-details="auto"
                ></v-text-field>
            </div>

            <div
                v-if="$vuetify.breakpoint.smAndDown" 
                class="mt-4"
            >
                <div
                    class="d-flex align-content-center"
                >
                    <v-icon class="mr-2">mdi-github</v-icon>
                    <v-text-field
                        v-model="edit.scmUrl"
                        label="Github URL"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </div>
                <div 
                    class="d-flex align-content-center mt-3"
                >
                    <v-icon class="mr-2">mdi-linkedin</v-icon>
                    <v-text-field
                        v-model="edit.linkedInUrl"
                        label="LinkedIn URL"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </div>
                <div 
                    class="d-flex align-content-center mt-3"
                >
                    <v-icon class="mr-2">mdi-web</v-icon>
                    <v-text-field
                        v-model="edit.websiteUrl"
                        label="Personal Website"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </div>
            </div>
        
            <v-row class="align-center">
                <v-col cols="12">
                    <div>Professional Summary</div>
                    <v-textarea
                        v-model="edit.summary"
                        class="mt-1"
                        outlined
                        hide-details="auto"
                    ></v-textarea>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Education Level</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.educationLevel"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="12" md="2" :class="{ 'pb-0': $vuetify.breakpoint.smAndDown }">
                    <div>Expected Salary</div>
                </v-col>
                <v-col cols="6" md="2">
                    <v-text-field
                        v-model="edit.expectedSalaryCurrency"
                        label="Currency"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>
                <v-col cols="6" md="2">
                    <v-text-field
                        v-model="edit.expectedSalary"
                        label="Amount"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Gender</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.gender"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Nationality</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.nationality"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Birthday</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-menu
                        v-model="birthdayMenu"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                    >
                        <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                                v-model="birthday"
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
                            ref="picker"
                            v-model="birthday"
                            @input="birthdayMenu = false"
                            :max="new Date().toISOString().substr(0, 10)"
                        ></v-date-picker>
                    </v-menu>
                </v-col>

                <v-col cols="6" md="2">
                    <div>Notice Period (months)</div>
                </v-col>
                <v-col cols="6" md="4">
                    <v-text-field
                        v-model="edit.noticePeriod"
                        outlined
                        dense
                        hide-details="auto"
                    ></v-text-field>
                </v-col>
            </v-row>
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
    name: 'ProfileEdit',
    props: {
        candidate: {
            required: true,
            type: Object
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            edit: {},

            avatarRules: [
                value => !value || value.size < 1000000 || 'Avatar size should be less than 1 MB!',
            ],

            birthday: null,
            birthdayMenu: false,
        }
    },
    computed: {
        name() {
            return this.edit.firstName + " " + this.edit.lastName;
        },
        expSalary() {
            return this.edit.expectedSalaryCurrency + " " + this.edit.expectedSalary;
        },
    },
    methods: {
        async updateCandidate() {
            this.loading = true;
            try {
                await this.$axios.put(this.$apiBase + '/v1/candidates/' + this.edit.id, this.edit, {
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
            await this.updateCandidate();
            this.$emit('close');
        }
    },
    created() {
        this.edit = JSON.parse(JSON.stringify(this.edit));
    },
    watch: {
        birthdayMenu (val) {
            val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
        },
        birthday (val) {
            if (val) {
                this.edit.birthday = new Date(val);
            } else {
                this.edit.birthday = null;
            }
        }
    },
}
</script>

<style scoped lang="scss">
</style>