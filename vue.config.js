const deployConfig = require ('./config');
const isDev = process.env.NODE_ENV && process.env.NODE_ENV.indexOf ('dev') > -1;
const TARGET_NODE = process.env.BUILD_TARGET === 'node';
const VueSSRServerPlugin = require ('vue-server-renderer/server-plugin');
const VueSSRClientPlugin = require ('vue-server-renderer/client-plugin');
const path = require ('path');
const resolve = file => path.resolve (__dirname, file);
const nodeExternals = require ('webpack-node-externals');
const webpack = require ('webpack');
const CopyWebpackPlugin = require ('copy-webpack-plugin');

const target = TARGET_NODE ? 'server' : 'client';

module.exports = {
  publicPath: deployConfig[`${isDev ? 'dev' : 'build'}`].assetsPublicPath,
  assetsDir: 'static',
  css: {
    sourceMap: !isDev && !TARGET_NODE,
  },
  devServer: {
    headers: {'Access-Control-Allow-Origin': '*'},
    proxy: deployConfig.dev.proxyTable,
    disableHostCheck: true,
  },
  transpileDependencies: [],
  configureWebpack: config => ({
    entry: `./src/entry-${target}.js`,
    target: TARGET_NODE ? 'node' : 'web',
    node: TARGET_NODE ? undefined : false,
    output: {
      libraryTarget: TARGET_NODE ? 'commonjs2' : undefined,
    },
    // hot: true,
    externals: TARGET_NODE
      ? nodeExternals ({
          allowlist: [/\.css$/, /\.?vue$type=style/],
        })
      : {
          AMap: 'window.AMap', // 高德地图配置
          // AMapUI: 'AMapUI',
        },
    optimization: {
      splitChunks: TARGET_NODE ? false : undefined,
    },
    plugins: [
      TARGET_NODE ? new VueSSRServerPlugin () : new VueSSRClientPlugin (),
      new webpack.DefinePlugin ({
        'process.env.VUE_ENV': `"${target}"`,
        'process.env.NODE_DEPLOY': `"${process.env.NODE_DEPLOY}"`,
        'process.env.config': getDeployConfigDefine (),
      }),
      //-------------
    ].concat (
      isDev
        ? []
        : new CopyWebpackPlugin (
            {
              patterns: [
                {
                  from: resolve ('./static'),
                  to: resolve ('./dist/static'),
                  // globOptions: {
                  //   dot: true,
                  //   gitignore: true,
                  //   ignore: ['index.html', '.DS_Store'],
                  // },
                  toType: 'dir',
                  // ignore: ['index.html', '.DS_Store'],
                },
                {
                  from: resolve ('./server'),
                  to: resolve ('./dist/server'),
                  toType: 'dir',
                  // ignore: [
                  //   'setup-dev-server.js',
                  //   'pm2.config.template.js',
                  //   '.DS_Store',
                  // ],
                },
                {
                  from: resolve ('./server/pm2.config.template.js'),
                  to: resolve ('./dist/server/pm2.config.js'),
                  transform: function (content) {
                    return content
                      .toString ()
                      .replace ('NODE_ENV_VALUE', process.env.NODE_ENV)
                      .replace ('NODE_PORT_VALUE', process.env.NODE_PORT)
                      .replace ('NODE_DEPLOY_VALUE', process.env.NODE_DEPLOY);
                  },
                },
                {
                  from: resolve ('./package.json'),
                  to: resolve ('./dist'),
                },
                {
                  from: resolve ('./package-lock.json'),
                  to: resolve ('./dist'),
                },
              ],
            },
            {
              ignore: ['./static/index.html'],
              copyUnmodified: true,
            }
          )
    ),
  }),
  chainWebpack: config => {
    // alias
    config.resolve.alias
      .set ('@', resolve ('src'))
      .set ('@assets', resolve ('src/assets'))
      .set ('@api', resolve ('api'));

    // reset public/index.html to static/index.html
    config.plugin ('html').tap (args => {
      args[0].template = resolve ('./static/index.html');
      return args;
    });

    if (TARGET_NODE) {
      // fix ssr bug: document not found -- https://github.com/Akryum/vue-cli-plugin-ssr/blob/master/lib/webpack.js
      const isExtracting = config.plugins.has ('extract-css');
      if (isExtracting) {
        // Remove extract
        const langs = ['css', 'postcss', 'scss', 'sass', 'less', 'stylus'];
        const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
        for (const lang of langs) {
          for (const type of types) {
            const rule = config.module.rule (lang).oneOf (type);
            rule.uses.delete ('extract-css-loader');
            // Critical CSS
            rule
              .use ('vue-style')
              .loader ('vue-style-loader')
              .before ('css-loader');
          }
        }
        config.plugins.delete ('extract-css');
      }

      config.module.rule ('vue').use ('cache-loader').tap (options => {
        // Change cache directory for server-side
        options.cacheIdentifier += '-server';
        options.cacheDirectory += '-server';
        return options;
      });
    }
    config.module.rule ('vue').use ('vue-loader').tap (options => {
      if (TARGET_NODE) {
        options.cacheIdentifier += '-server';
        options.cacheDirectory += '-server';
      }
      options.optimizeSSR = TARGET_NODE;
      return options;
    });

    // fix ssr hot update bug
    if (TARGET_NODE) {
      config.plugins.delete ('hmr');
    }

    // add svg loader
    const svgRule = config.module.rule ('svg');
    // clear before loaders
    svgRule.uses.clear ();
    svgRule.exclude.add (/node_modules/);
    svgRule
      .test (/\.svg$/)
      .use ('svg-sprite-loader')
      .loader ('svg-sprite-loader')
      .options ({
        symbolId: 'icon-[name]',
      });

    // add image loader
    const imagesRule = config.module.rule ('images');
    imagesRule.exclude.add (resolve ('src/icons'));
    config.module.rule ('images').test (/\.(png|jpe?g|gif|svg)(\?.*)?$/);
  },
};

function getDeployConfigDefine () {
  let config = {};
  Object.keys (deployConfig.env).forEach (function (key) {
    config[key] = `"${deployConfig.env[key]}"`;
  });
  return config;
}
