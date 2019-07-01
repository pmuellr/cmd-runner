'use strict'

const fastify = require('fastify')

const routes = require('./routes')
const logger = require('../lib/logger').createLogger(__filename)

/** @typedef { import("./types").IConfig } IConfig */
/** @typedef { import("./types").IHttpServer } IHttpServer */
/** @typedef { import("./types").IServerOptions } IServerOptions */

module.exports = {
  startServer,
  stopServer
}

/** @returns {Promise<IHttpServer>} async function to stop the server */
async function startServer (
  /** @type IServerOptions */ options
) {
  const server = fastify()

  routes.addRoutes(server, options.config)

  try {
    await server.listen(options.port)
  } catch (err) {
    logger.error(`error starting server: ${err.message}`)
    throw err
  }

  logger.info(`server listening on http://${options.host}:${options.port}`)

  return server
}

async function stopServer (
  /** @type IHttpServer */ server
) {
  try {
    await server.close()
  } catch (err) {
    logger.error(`error stopping server: ${err.message}`)
    throw err
  }

  logger.info(`server stopped`)
}
