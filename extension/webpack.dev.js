const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = (env) =>
  merge(common({ ...env, IS_PRODUCTION: false }), {
    mode: 'development',
    devtool: 'inline-source-map',
  })
