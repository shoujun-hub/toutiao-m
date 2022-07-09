module.exports = {
  pages: {
    index: {
      // 入口
      entry: 'src/main.js'
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://toutiao.itheima.net/',
        pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true
      }
    }
  }
}
