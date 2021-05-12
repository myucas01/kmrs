import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

import home from './modules/home';
import map from './modules/map';
import common from './modules/common';
import merge from './modules/merge';
Vue.use (Vuex);

export function createStore () {
  return new Vuex.Store ({
    modules: {
      home: home (),
      map,
      common,
			merge
    },
    state: {
      user: {
        userName: '',
        userId: '',
        nickName: '',
        roleIdList: [],
        orgIdList: [],
        menuList: [],
        authorities: [],
      },
      show: 0,
      step: 1,
      channelName: '',
      tabs: JSON.parse (window.sessionStorage.getItem ('pages')) || [
        {
          isPathNameCheck: false,
          link: '/index',
          needCatch: true,
          on: false,
          pam: {},
          path: '/index',
          title: '• 首页',
        },
      ],
      readTotal: 0,
    },
    getters,
    mutations,
    actions,
  });
}
