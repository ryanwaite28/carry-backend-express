const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');





module.exports = (env) => {
  console.log(`dirname:`, __dirname);
  console.log(`env:`, env);
  
  const ENTRY_FILE = path.resolve(__dirname, 'src', 'main.app.ts');
  const OUTPUT_PATH = path.resolve(__dirname, 'build');
  const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');
  const OUTPUT_FILE = `main.app.js`;
  
  console.log({ ENTRY_FILE, OUTPUT_PATH, OUTPUT_FILE, TSCONFIG_PATH });



  const usePlugins = [
    new NodemonPlugin(),
  ];
  
  console.log(`including static resources...`);
  usePlugins.push(
    new CopyPlugin({
      patterns: [
        { from: './.env', to: '' },
      ],
    })
  );

  return {
    target: 'node',
    mode: 'none',
    externals: [nodeExternals()],
    entry: ENTRY_FILE,
    devtool: "inline-source-map",
    output: {
      path: OUTPUT_PATH,
      filename: OUTPUT_FILE,
      libraryTarget: 'commonjs2'
    },
  
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: TSCONFIG_PATH
        })
      ]
    },

    plugins: usePlugins
  };
};