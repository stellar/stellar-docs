module.exports = () => ({
  name: "dev-server-plugin",

  configureWebpack() {
    return {
      devServer: {
        host: '0.0.0.0',
        client: {
          webSocketURL: {
            port: 0
          }
        }
      }
    }
  }
})