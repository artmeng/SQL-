const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // productionSourceMap:false,
  transpileDependencies: true,
  //关闭EsLint
  lintOnSave: false,
  transpileDependencies: true
})
