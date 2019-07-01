#!/usr/bin/env node
'use strict'

module.exports = { main }

/** @typedef { import("./lib/types").IConfig } IConfig */
/** @typedef { import("./lib/types").IHttpServer } IHttpServer */

const Config = require('./lib/config')
const Server = require('./lib/server')
// const Runner = require('./runner')
const logger = require('./lib/logger').createLogger(__filename)

// @ts-ignore
if (require.main === module) main()

async function main () {
  logger.debug('starting')

  const config = Config.readConfig('./cmd-runner.toml')
  logger.debug(`config: ${JSON.stringify(config, null, 4)}`)

  /** @type {IHttpServer} */
  let server
  try {
    server = await Server.startServer({
      host: config.host,
      port: config.port,
      config
    })
  } catch (err) {
    process.exit(1)
  }

  process.on('SIGINT', handleSignal)
  process.on('SIGTERM', handleSignal)

  async function handleSignal (signal) {
    console.log('')
    logger.warn(`received signal ${signal}, shutting down`)

    try {
      await Server.stopServer(server)
    } catch (err) {
      logger.error(`error stopping server: ${err.message}`)
      process.exit(1)
    }

    logger.info(`exiting`)
    process.exit(0)
  }
}
