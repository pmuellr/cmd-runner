'use strict'

const fastify = require('fastify')

const routes = require('./routes')
const logger = require('../lib/logger').createLogger(__filename)

/**
 * @typedef { import("net").AddressInfo } AddressInfo
 * @typedef { import("./config").Config } Config
 */

module.exports = {
  startServer
}

/**
 * @typedef {Object} ServerOptions
 * @property {string} host - host to bind the server to
 * @property {number} port - port to bind the server to
 * @property {Config} config - application configuration
 */

/** @param {ServerOptions} [options] */
/** @returns {Promise<() => Promise<void>>} async function to stop the server */
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

  return stopServer

  /** @returns {Promise<void>} */
  async function stopServer () {
    try {
      await server.close()
    } catch (err) {
      logger.error(`error stopping server: ${err.message}`)
      throw err
    }

    logger.info(`server stopped`)
  }
}
