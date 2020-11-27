<template>
    <v-app>
        <NavDrawer/>

        <AppBar/>

        <v-main>
            <router-view/>
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
        
        }
    },
};
</script>
