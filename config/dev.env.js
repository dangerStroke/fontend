'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_WEB_BASE_URL:"'http://yipaitongxin.cn'",
  VUE_IMG_BASE_URL:"'http://yipaitongxin.cn'"
})
