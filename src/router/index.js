import Vue from 'vue'
import VueRouter from 'vue-router'
// import Dashboard from '../views/Dashboard.vue'
import { authGuard } from "../auth/authGuard";

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   component: Dashboard,
  //   beforeEnter: authGuard
  // },
    {
        path: '/',
        name: 'Profile',
        component: () => import(/* webpackChunkName: "profile" */ '../views/Profile.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/projects',
        name: 'Projects',
        component: () => import(/* webpackChunkName: "projects" */ '../views/Projects.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/joblistings',
        name: 'Joblistings',
        component: () => import(/* webpackChunkName: "joblistings" */ '../views/Joblistings.vue'),
        beforeEnter: authGuard
    },
    {
        path: '/joblistings/:id',
        name: 'JoblistingShow',
        component: () => import(/* webpackChunkName: "joblistings" */ '../views/JoblistingShow.vue'),
        beforeEnter: authGuard
    },
    // {
    //     path: '/assessments',
    //     name: 'Assessments',
    //     component: () => import(/* webpackChunkName: "assessments" */ '../views/Assessments.vue'),
    //     beforeEnter: authGuard
    // },
    // {
    //     path: '/assessments/:id',
    //     name: 'AssessmentShow',
    //     component: () => import(/* webpackChunkName: "assessmentshow" */ '../views/AssessmentShow.vue'),
    //     beforeEnter: authGuard,
    //     props: true
    // },
    // {
    //     path: '/assessmentattempts/:id',
    //     name: 'AssessmentAttemptShow',
    //     component: () => import(/* webpackChunkName: "assessmentattemptshow" */ '../views/AssessmentAttemptShow.vue'),
    //     beforeEnter: authGuard,
    //     props: true
    // },
    {
        path: '*',
        name: 'Not Found',
        component: () => import(/* webpackChunkName: "notfound" */ '../views/NotFound.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
