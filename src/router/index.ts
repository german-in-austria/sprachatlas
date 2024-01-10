import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '../views/Home.vue';
import MapView from '../components/MapView.vue';
import QueryCreator from '../components/QueryCreator.vue';
import TagView from '@/components/TagView.vue';
import ListView from '@/components/ListView.vue';
import ChartViewer from '@/components/ChartViewer.vue';
import About from '@/views/About.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Map',
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
      },
      {
        path: 'graph',
        name: 'GraphView',
        component: ChartViewer
      }
    ]
  },
  {
    path: '/check',
    name: 'About',
    component: About
  }
];

const router = new VueRouter({
  mode: 'history',
  // @ts-ignore
  base: __dirname,
  routes: routes
});

export default router;
