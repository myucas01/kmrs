import axios from 'axios';
import Vue from 'vue';
const qs = require ('qs');
let loading = {};

function closeLoading () {
  var k = Object.keys (loading);
  if (k.length != 0) {
    loading.close ();
  }
}

async function commonParams (params) {
  let query = {
    isLoading: params.isLoading === undefined,
  };
  return {params, query};
}

axios.defaults.timeout = 300000;
axios.interceptors.request.use (
  function (config) {
    if (
      (config.data &&
        (typeof config.data === 'function' ||
          typeof config.data === 'string') &&
        config.data.match ('isLoading=true') !== null) ||
      (config.params && config.params.isLoading)
    ) {
      closeLoading ();
      loading = Vue.prototype.$loading ({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)',
      });
    }
    return config;
  },
  function (error) {
    closeLoading ();
    return Promise.reject (error);
  }
);
axios.interceptors.response.use (
  function (response) {
    if (
      response.data &&
      (typeof response.data === 'object' ||
        typeof response.data === 'string') &&
      ((response.config.params && response.config.params.isLoading) ||
        (response.config.data &&
          (typeof response.config.data === 'string' ||
            typeof response.config.data === 'function') &&
          response.config.data.match ('isLoading=true') !== null))
    ) {
      closeLoading ();
    }
    if (response.data) {
      let r = response.data;
      if (r.errorCode && r.errorCode != 0) {
        Vue.prototype.$message.error (r.errorMsg);
      }
      if (r.code && r.code != 200) {
        Vue.prototype.$message.error (r.msg || r.message);
      }
    }
    return response;
  },
  function (error) {
    closeLoading ();
    let res = error.response;
    switch (res.status) {
      case 401 || 403:
        Vue.prototype.$alert ('用户未登录或已在其他ip登录', '提示', {
          confirmButtonText: '确定',
          callback: () => {
            location.href = '/login';
          },
        });
        break;
      default:
        if (res.data) {
          Vue.prototype.$message.error (res.data.message);
        }
    }
    return Promise.reject (error);
  }
  // function (error) {
  //   loading.close ();
  //   if (error.response && error.response.status) {
  //     const status = error.response.status;
  //     if (status >= 500) {
  //       console.log (`服务器错误：${status}`);
  //     } else if (status == 401) {
  //       Vue.prototype.$alert ('用户未登录', '提示', {
  //         confirmButtonText: '确定',
  //         callback: () => {
  //           location.href = '/login';
  //         },
  //       });
  //     }
  //   } else {
  //     alert ('网络无连接');
  //   }
  //   return Promise.reject (error);
  // }
);
const api = {
  async get (url, params = {}, options = {}) {
    const parameter = await commonParams (params);
    params = Object.assign (parameter.query, parameter.params);
    try {
      let res = await axios.get (url, {params: params}, options);
      return new Promise (resolve => {
        // if (res.status === 200) {
        //   resolve (res.data);
        // } else {
        resolve (res.data);
        // }
      });
    } catch (err) {
      // if (err && err.response && err.response.status !== 401) {
      if (err) {
        // console.log (err);
      }
    }
  },
  async post (
    url,
    params = {},
    isForm = false,
    isFormData = false,
    options = {}
  ) {
    if (!isFormData) {
      const parameter = await commonParams (params);
      params = Object.assign (parameter.query, parameter.params);
    }
    if (isForm) {
      params = qs.stringify (params);
    }
    try {
      let res = await axios.post (url, params, options);
      res = res.data;
      return new Promise (resolve => {
        resolve (res);
      });
    } catch (err) {
      if (err) {
        console.log (err);
      }
    }
  },
  async delete (url, params = {}, options = {}) {
    const parameter = await commonParams (params);
    params = Object.assign (parameter.query, parameter.params);
    try {
      let res = await axios.delete (url, {params: params}, options);
      res = res.data;
      return new Promise (resolve => {
        resolve (res);
      });
    } catch (err) {
      if (err) {
        console.log (err);
      }
    }
  },
};
export const fetch = {
  install: Vue => {
    Vue.prototype.$fetch = api;
  },
};
