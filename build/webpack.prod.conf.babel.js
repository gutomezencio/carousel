import { pathResolve } from './utils'
import WebpackBar from 'webpackbar'
import { WebpackBundleSizeAnalyzerPlugin } from 'webpack-bundle-size-analyzer'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default {
  entry: './src/lib/export.js',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.s(a|c)ss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      app: pathResolve('src/app'),
      assets: pathResolve('src/app/assets')
    }
  },
  output: {
    path: pathResolve('dist/'),
    publicPath: '/',
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Carousel'
  },
  plugins: [
    new WebpackBar({
      name: 'Carousel App is building...',
      color: '#D6383E'
    }),
    new WebpackBundleSizeAnalyzerPlugin(pathResolve('dist/analyzer.txt')),
    new MiniCssExtractPlugin()
  ],
  externals: ['react', 'react-dom']
}
