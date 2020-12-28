<template>
    <v-card>
        <v-card-title>
            Preferred Roles
        </v-card-title>

        <v-card-text>
            <v-combobox
                v-model="edit.candidate.preferredRoles"
                :items="roles"
                label="Roles"
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
    name: 'RoleEdit',
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
            roles: [
                'Frontend',
                'Backend',
                'Fullstack',
                'Mobile'
            ],

            axiosConfig: {
                headers: {
                    Authorization: 'Bearer ' + this.$auth.token
                }
            }
        }
    },
    methods: {
        async updateRoles() {
            this.loading = true;
            try {
                await this.$axios.put(this.$apiBase + '/v1/users/' + this.edit.id, this.edit, this.axiosConfig);
            } catch (e) {
                this.error = e;
            } finally {
                this.loading = false;
            }
        },
        async save() {
            try {
                await this.updateRoles();
            } catch (e) {
                this.error = e;
            } finally {
                this.$emit('close');
            }
        },
    },
    created() {
        this.edit = JSON.parse(JSON.stringify(this.candidate));
    }
}
</script>

<style scoped lang="scss">
</style>