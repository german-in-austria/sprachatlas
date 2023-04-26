import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import MapView from '../components/MapView.vue';
import QueryCreator from '../components/QueryCreator.vue';
import TagView from '@/components/TagView.vue';
import ListView from '@/components/ListView.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: 'home',
    path: '/',
    component: Home,
    children: [
      {
        path: '',
        name: 'Karte',
        component: MapView
      },
      {
        path: 'query',
        name: 'Query',
        component: QueryCreator
      },
      {
        path: 'tags',
        name: 'TagSelection',
        component: TagView
      },
      {
        path: 'list',
        name: 'ResultList',
        component: ListView
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  routes
});

export default router;
