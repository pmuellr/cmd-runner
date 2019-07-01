'use strict'

module.exports = {
  addRoutes
}

const pkg = require('../package.json')

/** @typedef { import("./types").IConfig } IConfig */
/** @typedef { import("./types").IHttpServer } IHttpServer */

function addRoutes (
  /** @type IHttpServer */ server,
  /** @type IConfig */ config
) {
  server.get('/api', async (request, reply) => {
    const version = pkg.version
    return { version }
  })

  server.get('/api/commands', async (request, reply) => {
    return { commands: config.commands }
  })
}
