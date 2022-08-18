const { CracoAliasPlugin } = require('react-app-alias');
const SassResourcesLoader = require('craco-sass-resources-loader');

module.exports = {
  webpack: {
    configure: configureCSSModules,
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
