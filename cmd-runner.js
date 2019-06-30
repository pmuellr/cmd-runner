#!/usr/bin/env node

'use strict'

const logger = require('./lib/logger').createLogger(__filename)
const Config = require('./lib/config')

logger.debug('starting')

const config = Config.readConfig('./cmd-runner.toml')
console.log(JSON.stringify(config, null, 4))
