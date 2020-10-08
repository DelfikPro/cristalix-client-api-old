const path = require('path');

moduleName = process.env.MODULE_NAME + '';
if (!/^[A-Za-z0-9_-]+$/.test(moduleName)) throw new Error("Invalid MODULE_NAME: " + moduleName);

module.exports = {
  entry: './src/' + moduleName + '.ts',
  mode: 'production',
  output: {
    filename: moduleName + '.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'this',
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
    extensions: [ '.tsx', '.ts', '.js' ],
  }
};
