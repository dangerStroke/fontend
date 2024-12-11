'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_WEB_BASE_URL:"'http://yipaitongxin.cn:30002/broadband'",
  VUE_IMG_BASE_URL:"'http://yipaitongxin.cn:30002'"
})
