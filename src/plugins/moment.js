import Vue from 'vue';
// 时间工具
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale ('zh-cn');
Vue.prototype.$moment = moment;
