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

/** @type {(options: IServerOptions) => Promise<IHttpServer>} */
async function startServer (options) {
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

/** @type {(server: IHttpServer) => Promise<void>} */
async function stopServer (server) {
  try {
    await server.close()
  } catch (err) {
    logger.error(`error stopping server: ${err.message}`)
    throw err
  }

  logger.info(`server stopped`)
}
