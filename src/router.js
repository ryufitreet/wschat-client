import Vue from 'vue';
import store from '@/store/store';
import Router from 'vue-router';
import Enter from './views/Enter.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'enter',
      component: Enter,
    },
    {
      path: '/signin',
      name: 'signin',
      component: () => import('./views/SignForms.vue'),
      props: { route: 'signin' },
      beforeEnter: (from, to, next) => {
        if (store.state.isAuthorized) {
          next('/');
        } else {
          next();
        }
      },
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/SignForms.vue'),
      props: { route: 'signup' },
      beforeEnter: (from, to, next) => {
        if (store.state.isAuthorized) {
          next('/');
        } else {
          next();
        }
      },
    },
    {
      path: '/chat',
      name: 'chat',
      beforeEnter: (from, to, next) => {
        if (store.state.isAuthorized) {
          next();
        } else {
          next('/');
        }
      },
      component: () => import('./views/Chat.vue'),
    },
  ],
});
