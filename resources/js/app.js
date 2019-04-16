/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router';
import VueX from 'vuex';
import Loading from 'vue-loading-overlay';
import VeeValidate from 'vee-validate';
import VeeValidateMessagesVi from "vee-validate/dist/locale/vi";
import messages from 'vee-validate/dist/locale/nl';
import wysiwyg from 'vue-wysiwyg';
import base from 'js/components/base';
import home from 'js/components/home';
import login from 'js/components/login';
import register from 'js/components/register';
import detail from 'js/components/detail';
import profile from 'js/components/profile';
import post from 'js/components/post';
import notFound from 'js/components/not-found';
import userModel from 'js/models/user';

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

// const files = require.context('./', true, /\.vue$/i);
// files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default));

Vue.use(VueRouter);
Vue.use(VueX);
Vue.use(Loading, {
  loader: 'dots'
});
Vue.use(VeeValidate, {
    locale: 'vi',
    dictionary: {
        vi: VeeValidateMessagesVi
    }
});
Vue.use(wysiwyg, {});

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: base,
            props: true,
            children: [
                {
                    path: '',
                    component: home,
                    props: true,
                    name: 'home'
                },
                {
                    path: 'login',
                    component: login,
                    props: true,
                    name: 'login'
                },
                {
                    path: 'register',
                    component: register,
                    props: true,
                    name: 'register'
                },
                {
                    path: 'profile',
                    component: profile,
                    props: true,
                    name: 'profile',
                    meta: {
                        requiresAuth: true
                    },
                },
                {
                    path: 'create',
                    component: post,
                    props: true,
                    name: 'create',
                    meta: {
                        requiresAuth: true
                    },
                },
                {
                    path: 'edit/:id',
                    component: post,
                    props: true,
                    name: 'edit',
                    meta: {
                        requiresAuth: true
                    },
                },
                {
                    path: 'post/:id',
                    component: detail,
                    props: true,
                    name: 'post'
                },
                {
                    path: '*',
                    component: notFound,
                    props: true,
                    name: 'not-found'
                }
            ]
        }
    ],
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth) && !localStorage.getItem('api_token')) {
        next({ name: 'login' });
    }
    next();
});

const store = new VueX.Store({
    state: {
        user: null,
        title: '',
    },
    mutations: {
        SET_AUTH_USER(state, payload) {
            state.user = new userModel(payload);
        },
        UNSET_AUTH_USER(state) {
            state.user = null;
        },
        SET_TITLE(state, payload) {
            state.title = payload;
        },
    },
    actions: {
        login({ commit, state }, payload) {
            commit('SET_AUTH_USER', payload);
            localStorage.setItem('api_token', payload.api_token);
            router.push({name : 'home'});
        },
        logout({ commit, state }, payload) {
            commit('UNSET_AUTH_USER');
            localStorage.removeItem('api_token');
            router.push({name: 'login'});
        },
        setTitle({ commit, state }, payload) {
            commit('SET_TITLE', payload);
            document.title = payload;
        }
    }
});

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    store
});
