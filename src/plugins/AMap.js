import Vue from 'vue';

export const AMap = window ? window.AMap : {};

export const AMapUI = window ? window.AMapUI : {};

Vue.use (AMap);
Vue.use (AMapUI);
