<template>
    <v-card>
        <v-card-title>
            Skills
        </v-card-title>

        <v-card-text>
            <v-combobox
                v-model="select"
                :items="skills"
                item-text="name"
                label="Skills"
                outlined
                multiple
                chips
            ></v-combobox>
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
    name: 'SkillEdit',
    props: {
        candidate: {
            required: true,
            type: Object
        }
    },
    computed: {
        userSkills() {
            return this.candidate.skills || [];
        }
    },
    data() {
        return {
            loading: false,
            error: null,
            select: [],
            skills: [],
        }
    },
    methods: {
        async getSkills() {
            this.loading = true;
            try {
                var response = await this.$axios.get(this.$apiBase + '/v1/skills', {
                    headers: {
                        Authorization: 'Bearer ' + this.$auth.token
                    }
                });
                this.skills = response.data.skills;
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async createSkill(skill) {
            this.loading = true;
            try {
                var response = await this.$axios.post(this.$apiBase + '/v1/skills', {
                    name: skill
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
        async updateUserSkills() {
            var existingSkills = this.skills.map(skill => skill.name);
            this.select.forEach(async skill => {
                // if skill does not exist, create it
                if (!skill.id && !existingSkills.includes(skill)) {
                    var response = await this.createSkill(skill);
                    skill = response.data;
                }

                // create user skill if not in current skills
                if (!this.userSkills.includes(skill)) {
                    this.createUserSkill(skill);
                }
            });

            // delete all skills that have been removed
            this.userSkills.forEach(skill => {
                if (!this.select.includes(skill)) {
                    this.deleteUserSkill(skill);
                }
            })
        },
        async createUserSkill(skill) {
            this.loading = true;
            try {
                await this.$axios.post(this.$apiBase + '/v1/userskills', {
                    candidate_id: this.candidate.id,
                    skill_id: skill.id
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
        async deleteUserSkill(userSkill) {
            this.loading = true;
            try {
                await this.$axios.delete(this.$apiBase + '/v1/userskills/' + userSkill.id, {
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
                await this.updateUserSkills();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
    },
    created() {
        this.getSkills();
        this.select = this.userSkills;
    }
}
</script>

<style scoped lang="scss">
</style>