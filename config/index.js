const deploy = process.env.NODE_DEPLOY || 'prod';
const envBase = require ('./env/env');
const envDeploy = require (`./env/env.${deploy}`);
console.log ('deploy:::', deploy);
const env = Object.assign (envBase, envDeploy);
console.log ('env:', env);
module.exports = {
  env,
  build: {
    assetsPublicPath: env.CDN_HOST,
  },

  dev: {
    assetsPublicPath: undefined,
    proxyTable: {
      '/api': {
        target: 'http://192.168.0.101:7777',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
      '/user-api': {
        target: 'http://192.168.0.101:7776', //env.CNODE_HOST1,
        changeOrigin: true,
        pathRewrite: {
          '^/user-api': '/',
        },
      },
      // '/ws-api': {
      //   target: 'ws://192.168.0.101:8888',
      //   ws: true,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/ws-api': '',
      //   },
      // },
    },
  },
};
