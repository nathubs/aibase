const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(createProxyMiddleware('/api', {
    target: 'https://testiot.ubtrobot.com/',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      "^/api": ""
    }
  }))
}

