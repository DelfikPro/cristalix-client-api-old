const path = require('path');

module.exports = {
  entry: './src/hub.ts',
  mode: 'production',
  output: {
    filename: 'hub.bundle.js',
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