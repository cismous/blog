import _ from "lodash";
import webpack from "webpack";
import yargs from "yargs";
import path from "path";
import ExtractTextPlugin, { extract } from "extract-text-webpack-plugin";

const argv = yargs
  .alias("p", "optimize-minimize")
  .alias("d", "debug")
  .alias("s", "dev-server")
  .argv;

const defaultOptions = {
  devServer: argv.devServer,
  cdn: argv.cdn,
  development: argv.debug
};

/**
 * get assets public path
 *
 * @param {Object} options
 * @return {String}
 * @api private
 */

function getPublicPath(options) {
  if (options.cdn)
    return require('../src/config/config').app.cdn;
  else if (options.devServer)
    return "/_assets/";
  else
    return "/";
}

export default _options => {
  const options = _.merge({}, defaultOptions, _options);
  options.publicPath = getPublicPath(options);
  options.hotPort = 4002;
  const environment = options.test || options.development ? "development" : "production";

  return {
    entry: {
      style: './assets/stylesheet/app.scss',
      index: './assets/javascript/index.js',
    },

    output: {
      path: './build/public',
      publicPath: options.publicPath,
      chunkFilename: '[name].js?[chunkhash]',
      filename: '[name].js'
    },

    module: {
      loaders: [
        {test: /\.js$/, loader: 'babel', exclude: /node_modules/},
        {test: /\.scss$/, loader: extract('style-loader', 'css!sass')},
        {test: /\.(gif|png|jpg)$/, loader: 'url-loader?limit=8192'},
        {test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader'}
      ],
      noParse: [/socket.io/]
    },

    plugins: [
      new webpack.PrefetchPlugin("socket.io-client"),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify(environment)
        }
      }),
      new ExtractTextPlugin("app.css"),
      new ExtractTextPlugin("app.webp.css"),
      function () {
        this.plugin("done", stats => {
          require("fs").writeFileSync(
            path.join(__dirname, "..", "build/stats.json"),
            JSON.stringify(stats.toJson())
          );
        })
      }
    ],

    resolve: {
      root: './',
      extensions: ['', '.js', '.json', '.scss']
    },

    devServer: {
      host: "localhost",
      port: options.hotPort
    }
  };
}
