<template>
    <v-container class="notfound">
        <h1 class="text-center red lighten-4 mb-10 rounded">Page Not Found</h1>
        <v-img
            class="mx-auto"
            transition="scale-transition"
            src="@/assets/bg-404.svg"
            max-height="668"
            max-width="752"
        ></v-img>
    </v-container>
</template>

<script>
export default {
    name: 'NotFound',
    data() {
        return {
        }
    },
    created() {
        this.$emit('cancel-loading');
        this.$emit('no-drawer');
    }
}
</script>