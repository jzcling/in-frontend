<template>
    <v-app>
        <NavDrawer/>

        <AppBar/>

        <v-main>
            <v-overlay 
                v-if="loading"
                absolute
                opacity="0.2"
            >
                <v-progress-circular
                    :size="50"
                    :width="5"
                    color="indigo lighten-1"
                    indeterminate
                ></v-progress-circular>
            </v-overlay>

            <router-view
                @cancel-loading="loading = false"
            ></router-view>
        </v-main>
    </v-app>
</template>

<script>
import NavDrawer from './components/NavDrawer';
import AppBar from './components/AppBar';

export default {
    name: 'App',

    components: {
        NavDrawer,
        AppBar
    },

    data() {
        return {
            loading: true
        }
    },
};
</script>
