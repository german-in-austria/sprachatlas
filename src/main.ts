import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'leaflet/dist/leaflet.css';
import vuetify from './plugins/vuetify';
import { Icon } from 'leaflet';

type D = Icon.Default & {
  _getIconUrl?: string;
}
delete (Icon.Default.prototype as D)._getIconUrl;

Vue.config.productionTip = false;

const vm = new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');

export default vm;
