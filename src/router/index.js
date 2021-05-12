import Vue from 'vue';
import VueRouter from 'vue-router';
import LayoutView from '../views/LayoutView.vue';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Index from '../views/Index.vue';
import Demo from '../views/Demo.vue';
import Account from '../views/Account.vue';
import MessageList from '../views/MessageList.vue';
import ElementDemo from '../views/ElementDemo.vue';
import OrganizeBoundariesRoute from './OrganizeBoundariesRoute';
import Function from './Function.js'
import Record from './Record.js'

Vue.use (VueRouter);

const routes = [
  {
    path: '/',
    component: LayoutView,
    children: [
      {
        path: '/',
        name: 'Home',
        component: Home,
        redirect: '/login',
        children: [
          {
            path: 'index',
            name: 'Index',
            component: Index,
            meta: {keepAlive: true},
          },
          {
            path: 'demo',
            name: 'Demo',
            component: Demo,
            meta: {keepAlive: true},
          },
          {
            path: 'element-demo',
            name: 'ElementDemo',
            component: ElementDemo,
          },
          {
            path: 'account',
            name: 'Account',
            component: Account,
            meta: {keepAlive: true},
          },
          {
            path: 'message-list',
            name: 'MessageList',
            component: MessageList,
            meta: {keepAlive: true},
          },
          OrganizeBoundariesRoute,
					Function,
					Record
        ],
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '*',
    redirect: '/index',
  },
];

const router = new VueRouter ({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});
/**
 * 解决 重复点击当前路由报错问题
 * @type {{(location: RawLocation): Promise<Route>; (location: RawLocation, onComplete?: Function, onAbort?: ErrorHandler): void}}
 */
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push (location) {
  return originalPush.call (this, location).catch (err => err);
};

export function createRouter () {
  return router;
}
