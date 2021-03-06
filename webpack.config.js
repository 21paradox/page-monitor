const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const fs = require('fs');
const sass = require('sass');
const IconFontPlugin = require('icon-font-loader').Plugin;
const { publicPath } = require('./app.conf.js');

const devMode = process.env.NODE_ENV !== 'production';
/* eslint no-underscore-dangle: 0 */
const cdnModules = [
  {
    name: 'react',
    var: 'React',
    path: 'umd/react.production.min.js',
  },
  {
    name: 'prop-types',
    var: 'PropTypes',
    path: 'prop-types.min.js',
  },
  {
    name: 'react-dom',
    var: 'ReactDOM',
    path: 'umd/react-dom.production.min.js',
  },
  {
    name: 'react-router-dom',
    var: 'ReactRouterDOM',
    path: 'umd/react-router-dom.min.js',
  },
  {
    name: 'react-intl',
    var: 'ReactIntl',
    path: 'dist/react-intl.min.js',
  },
  {
    name: 'moment',
    var: 'moment',
    path: 'min/moment.min.js',
  },
  {
    name: 'moment/locale/zh-cn',
    var: 'moment.locale',
    path: require.resolve('./node_modules/moment/min/moment-with-locales.min.js'),
  },
  {
    name: 'styled-components',
    var: 'styled',
    path: 'dist/styled-components.min.js',
  },
  {
    name: 'echarts',
    var: 'echarts',
    path: 'dist/echarts.min.js',
  },
  {
    name: 'jquery',
    var: 'jQuery',
    path: 'dist/jquery.min.js',
  },
  // {
  //   name: 'amis',
  //   var: 'AMis',
  //   path: '../build-a-mis/dist/amis.min.js',
  // },
];
function cpFile(inFilePath, outFilePath) {
  return new Promise((resolve, reject) => {
    const writeFile = fs.createWriteStream(outFilePath, {
      flags: 'a',
    });
    fs.createReadStream(inFilePath).pipe(writeFile);
    writeFile.on('error', reject);
    writeFile.on('close', resolve);
  });
}

const vendorPlugin = {
  apply: (compiler) => {
    compiler.hooks.afterEmit.tap('vendorPlugin', () => {
      if (devMode) return;
      const writeVendor = async () => {
        for (let i = 0; i < cdnModules.length; i += 1) {
          /* eslint-disable-next-line no-await-in-loop */
          await cpFile(
            path.resolve(__dirname, './node_modules', cdnModules[i].name, cdnModules[i].path),
            path.resolve(__dirname, './dist/vendor.js'),
          );
        }
      };
      writeVendor();
    });
  },
};

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'), // 项目的起点入口

  // 项目输出配置
  output: {
    path: path.resolve(__dirname, 'public'),
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js',
    publicPath: `${publicPath}`,
  },
  plugins: [
    // 插件配置
    new CleanWebpackPlugin(['public']), // 清空编译输出文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(`${__dirname}/static`), // 打包的静态资源目录地址
        to: '', // 打包到dist下面
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'), // 模板
      filename: 'index.html',
      inject: false,
    }), // 生成Html5文件
    new WebpackCdnPlugin({
      modules: cdnModules.map(v => Object.assign({}, v)),
      prod: !devMode,
      publicPath: `${publicPath}/node_modules`,
      prodUrl: 'https://cdn.jsdelivr.net/npm/:name@:version/:path',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    vendorPlugin,
    new IconFontPlugin(),
  ],
  module: {
    // 模块加载
    rules: [
      {
        test: /\.css$/, // 匹配规则
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.less$/, // 匹配规则
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'icon-font-loader',
            options: {
              // fontName: '--iconfont',
            },
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192, // 小于8192B的文件转为base64文件
            name: 'images/[name].[hash:5].[ext]',
          },
        },
      },
      { test: /\.(woff|woff|woff2|eot|ttf|otf)$/, loader: 'url-loader?limit=8192' },
    ],
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },

  resolve: {
    alias: {
      'flv.js': require.resolve('./node_modules/flv.js/dist/flv.js'),
    },
  },
};
