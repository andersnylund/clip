const path = require('path')

module.exports = {
  entry: {
    popup: path.join(__dirname, 'src/popup/index.tsx'),
    background: path.join(__dirname, 'src/background/background.ts'),
    content: path.join(__dirname, 'src/content/content.ts'),
  },
  output: {
    path: path.join(__dirname, 'dist/js'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
}
