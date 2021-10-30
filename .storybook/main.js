const path = require('path')

module.exports = {
  core: {
    builder: "webpack5",
  },
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    config.module.rules.push({
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
        'sass-loader'
      ]
    });

    config.resolve.alias = {
      ...config.resolve.alias,
      app: path.resolve(__dirname, '../src/app'),
      assets: path.resolve(__dirname, '../src/app/assets')
    }

    // Return the altered config
    return config;
  }
}
