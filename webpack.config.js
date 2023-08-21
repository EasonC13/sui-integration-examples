const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const webpack = require('webpack');
const slsw = require('serverless-webpack');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const { isLocal } = slsw.lib.webpack;

const externals = ['knex'];
const servicePath = '';
const nodeVersion = null;
const forceExclude = ['aws-sdk'];
const tsConfigPath = path.resolve(servicePath, 'tsconfig.json');

const ENABLE_SOURCE_MAPS = true;
const ENABLE_TYPESCRIPT = fs.existsSync(tsConfigPath);
const ENABLE_TSCHECKER = true;
const ENABLE_CACHING = !!isLocal;

const computedExternals = externals.concat(forceExclude);

const extensions = [
  '.wasm',
  '.mjs',
  '.js',
  '.jsx',
  '.json',
  '.ts',
  '.tsx',
  '.graphql',
  '.gql',
];

function parseTsConfig() {
  const tsConfigJSON = ts.readConfigFile(tsConfigPath, ts.sys.readFile).config;
  return ts.parseJsonConfigFileContent(tsConfigJSON, ts.sys, './');
}

const parsedTsConfig = parseTsConfig();

function babelLoader() {
  const plugins = [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',
  ];

  if (ENABLE_SOURCE_MAPS) {
    plugins.push('babel-plugin-source-map-support');
  }

  return {
    loader: 'babel-loader',
    options: {
      cacheDirectory: ENABLE_CACHING,
      cacheCompression: false,
      plugins: plugins.map(require.resolve),
      presets: [
        [
          require.resolve('@babel/preset-env'),
          {
            targets: {
              node: nodeVersion,
            },
          },
        ],
      ],
    },
  };
}

function tsLoader() {
  return {
    loader: 'ts-loader',
    options: {
      projectReferences: true,
      configFile: tsConfigPath,
      experimentalWatchApi: true,
      transpileOnly: ENABLE_TSCHECKER,
    },
  };
}

function getLoaders() {
  const loaders = {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [babelLoader()],
      },
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
    ],
  };

  if (ENABLE_TYPESCRIPT) {
    const tsRule = {
      test: /\.(ts|tsx)$/,
      use: [tsLoader()],
      exclude: [
        [
          path.resolve(servicePath, 'node_modules'),
          path.resolve(servicePath, '.serverless'),
          path.resolve(servicePath, '.webpack'),
        ],
      ],
    };

    loaders.rules.push(tsRule);
  }

  return loaders;
}

function getPlugins() {
  const plugins = [];

  if (ENABLE_TYPESCRIPT && ENABLE_TSCHECKER) {
    plugins.push(
      new ForkTsCheckerWebpackPlugin({
        typescript: {
          configFile: tsConfigPath,
          build: true,
        },
      })
    );
  }

  // Ignore all locale files of moment.js
  plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^pg-native$/,
    }),
  );

  return plugins;
}

function resolvePlugins() {
  const plugins = [];

  if (ENABLE_TYPESCRIPT && (parsedTsConfig.options || {}).baseUrl) {
    plugins.push(
      new TsconfigPathsPlugin({
        configFile: tsConfigPath,
        extensions,
      })
    );
  }

  return plugins;
}

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  context: __dirname,
  stats: 'errors-only',
  devtool: ENABLE_SOURCE_MAPS ? 'source-map' : '',
  externals: computedExternals,
  mode: isLocal ? 'development' : 'production',
  performance: {
    hints: false,
  },
  resolve: {
    symlinks: false,
    extensions,
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
    plugins: resolvePlugins(),
  },
  module: getLoaders(),
  optimization: isLocal
    ? {
        nodeEnv: false,
        splitChunks: false,
        removeEmptyChunks: false,
        removeAvailableModules: false,
      }
    : {
        nodeEnv: false,
        minimize: false,
      },
  plugins: getPlugins(),
  node: {
    __dirname: false,
  },
};
