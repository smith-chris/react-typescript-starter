const path = require('path')

const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

const isDev = process.argv.indexOf('-p') === -1

const ASSETS_PATH = [path.resolve('./src/assets')]

let urlLoaderOptions = Object.assign(
  {
    limit: 16 * 1024,
  },
  isDev
    ? {
        // use full path in development for better readability
        name: '[path][name].[ext]',
      }
    : {
        outputPath: 'assets/',
      },
)

const SIZEOF_LOADER_CONFIG = {
  loader: 'sizeof-loader',
  options: urlLoaderOptions,
}

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve('./dist'),
    filename: 'bundle.js',
    publicPath: '',
  },
  resolveLoader: {
    modules: ['node_modules', path.resolve('./src/loaders')],
  },
  resolve: {
    extensions: [
      '.tsx',
      '.ts',
      '.js',
      '.jsx',
      '.json',
      isDev ? '.dev.tsx' : '.prod.tsx',
      isDev ? '.dev.js' : '.prod.js',
    ],
    modules: ['node_modules', path.resolve('./src')],
  },
  devtool: 'source-map',
  plugins: [new ForkTsCheckerWebpackPlugin(), new FriendlyErrorsWebpackPlugin()],
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: path.resolve('./src'),
        use: [
          { loader: 'cache-loader' },
          {
            loader: 'thread-loader',
            options: {
              // there should be 1 cpu for the fork-ts-checker-webpack-plugin
              workers: require('os').cpus().length - 1,
            },
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true, // use transpileOnly mode to speed-up compilation
              happyPackMode: true, // use happyPackMode mode to speed-up compilation and reduce errors reported to webpack
            },
          },
        ],
      },
      {
        test: /\.(xml)$/,
        include: ASSETS_PATH,
        use: [
          {
            loader: 'raw-loader',
            options: {},
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        include: ASSETS_PATH,
        use: [
          {
            loader: 'url-loader',
            options: urlLoaderOptions,
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        include: ASSETS_PATH,
        use: [SIZEOF_LOADER_CONFIG],
      },
      {
        test: /\.(css)$/,
        include: [path.resolve('./src'), path.resolve('./node_modules')],
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
