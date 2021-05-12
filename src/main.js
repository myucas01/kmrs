import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import {createRouter} from './router';
import {createStore} from './store';
import {sync} from 'vuex-router-sync';
import '../public/style/basic.scss';
import './plugins/element.js';
import './plugins/vueCurrencyFilter.js';
import './styles.scss';
import '../public/style/element-adjust.scss';
import './icons';
import './plugins/AMap.js';
import './plugins/moment.js';
import './assets/icon/iconfont.js';
import VueCookies from 'vue-cookies';
import {fetch} from '../api';
import directive from './util/directives/globalDirective';
import * as filters from './util/filters';
import './plugins/vant.js';
import {SocketMethod} from './util/socketUtils';

Vue.use (VueCookies);
Vue.use (fetch);
Vue.use (directive);
Vue.use (SocketMethod);
Vue.config.productionTip = false;
Object.keys (filters).forEach (key => {
  Vue.filter (key, filters[key]);
});
export function createApp () {
  const router = createRouter ();
  const store = createStore ();
  sync (store, router);
  const app = new Vue ({
    router,
    store,
    render: h => h (App),
  });
  return {app, router, store};
}
