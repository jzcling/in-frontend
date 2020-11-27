<template>
    <v-app-bar
        app
        color="primary"
        dark
    >
        <div class="d-flex align-center">
            <h2>HubbedIn</h2>
        </div>

        <v-spacer></v-spacer>
    </v-app-bar>
</template>

<script>
export default {
    name: 'AppBar',
    props: {
        // title: {
        //     required: true,
        //     type: String
        // }
    },

    data() {
        return {

        }
    }
}
</script>