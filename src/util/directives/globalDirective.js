import Vue from 'vue';

//按钮权限指令;
const auth = Vue.directive ('auth', {
  inserted: function (el, binding) {
    let BtnAuthorizationList = window.$cookies.get ('userId')
      ? window.localStorage.authorities
      : '';
    if (BtnAuthorizationList) {
      let authBoolean = false;
      BtnAuthorizationList = JSON.parse (BtnAuthorizationList);
      for (const item of BtnAuthorizationList) {
        if (item.authority === binding.value) {
          authBoolean = true;
          break;
        }
      }
      if (!authBoolean) {
        el.parentNode.removeChild (el);
      }
    }
  },
});

const directive = {auth};
export default directive;
