'use strict'

module.exports = {
  addRoutes
}

/** @typedef { import("./types").IConfig } IConfig */
/** @typedef { import("./types").IHttpServer } IHttpServer */

const pkg = require('../package.json')

/** @type {(server: IHttpServer, config: IConfig) => void} */
function addRoutes (server, config) {
  server.get('/api', async (request, reply) => {
    const version = pkg.version
    return { version }
  })

  server.get('/api/commands', async (request, reply) => {
    return { commands: config.commands }
  })
}
