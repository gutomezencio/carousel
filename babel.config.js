module.exports = function (api) {
  api.cache(true)

  return {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      ['babel-plugin-react-scoped-css'],
      ['@babel/plugin-proposal-class-properties'],
      ['@babel/plugin-transform-runtime',
        {
          'regenerator': true
        }
      ]
    ]
  }
}
