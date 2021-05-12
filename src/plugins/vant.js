import Vue from 'vue';
import Vant from 'vant';

Vue.use (Vant);

if (process.env.VUE_ENV === 'client') {
  require ('vant/lib/index.css');
}
