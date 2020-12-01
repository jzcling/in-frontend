const fs = require('fs')

module.exports = {
    "transpileDependencies": [
      "vuetify"
    ],
    devServer: {
        host: 'hubbedin.dev',
        port: 3000,
        https: {
            key: fs.readFileSync("./certs/hubbedin.dev.key"),
            cert: fs.readFileSync("./certs/hubbedin.dev.crt")
        }
    }
}