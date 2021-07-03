const path = require('path')
const Dotenv = require('dotenv-webpack')

module.exports = (env) => ({
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
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  plugins: [
    new Dotenv({
      path: `./.env${env.IS_PRODUCTION ? '' : '.development'}`,
    }),
  ],
})
