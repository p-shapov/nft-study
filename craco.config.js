const { CracoAliasPlugin } = require('react-app-alias');
const SassResourcesLoader = require('craco-sass-resources-loader');
const { addPlugins } = require('@craco/craco');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => configurePolyfills(configureCSSModules(config)),
  },
  plugins: [
    {
      plugin: SassResourcesLoader,
      options: {
        resources: './src/shared/styles/global.scss',
      },
    },
    {
      plugin: CracoAliasPlugin,
      options: {
        baseUrl: '.',
        tsconfig: './tsconfig.json',
      },
    },
  ],
};

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

function configurePolyfills(webpackConfig) {
  webpackConfig.resolve.fallback = {
    ...webpackConfig.resolve.fallback,
    buffer: require.resolve('buffer/'),
  };

  addPlugins(webpackConfig, [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return webpackConfig;
}

function configureCSSModules(webpackConfig) {
  webpackConfig.module.rules = webpackConfig.module.rules.map((rule) => {
    if (!Array.isArray(rule.oneOf)) return rule;

    rule.oneOf = rule.oneOf
      .map((loader) => {
        if (String(loader.test) === String(cssRegex) || String(loader.test) === String(sassRegex)) {
          return null;
        }

        if (String(loader.test) === String(cssModuleRegex)) loader.test = cssRegex;

        if (String(loader.test) === String(sassModuleRegex)) loader.test = sassRegex;

        return loader;
      })
      .filter(Boolean);

    return rule;
  });

  return webpackConfig;
}
