import { pathResolve } from './utils'
import webpack from 'webpack'
import WebpackBar from 'webpackbar'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export default {
  entry: './src/app/index.js',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2
            }
          },
          'scoped-css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      app: pathResolve('src/app'),
      assets: pathResolve('src/app/assets'),
      'react-dom': '@hot-loader/react-dom'
    }
  },
  output: {
    path: pathResolve('dist/'),
    publicPath: '/',
    filename: 'index.js'
  },
  devServer: {
    clientLogLevel: 'warning',
    contentBase: '/',
    port: 4000,
    publicPath: '/',
    hotOnly: true,
    disableHostCheck: true,
    quiet: true,
    historyApiFallback: true
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: false,
      chunksSortMode: 'auto'
    }),
    new WebpackBar({
      name: 'Carousel App is building...',
      color: '#D6383E'
    }),
  ]
}
