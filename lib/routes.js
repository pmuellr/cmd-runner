'use strict'

module.exports = {
  addRoutes
}

const pkg = require('../package.json')

/**
 * @typedef { import("fastify").FastifyInstance } FastifyInstance
 * @typedef { import("./config").Config } Config
 */

/** @param {FastifyInstance} server */
/** @param {Config} config */
function addRoutes (server, config) {
  server.get('/api', async (request, reply) => {
    const version = pkg.version
    return { version }
  })

  server.get('/api/commands', async (request, reply) => {
    return { commands: config.commands }
  })
}
