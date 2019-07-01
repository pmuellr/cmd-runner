'use strict'

const fs = require('fs')
const path = require('path')

const joi = require('@hapi/joi')
const toml = require('toml')

const utils = require('./utils')
const logger = require('./logger').createLogger(__filename)

/** @typedef { import('./types').IConfig } IConfig */
/** @typedef { import('./types').ICommand } ICommand */

module.exports = {
  readConfig
}

/** @type {(fileName: string) => IConfig} */
function readConfig (
  fileName
) {
  let contents
  try {
    contents = fs.readFileSync(fileName, 'utf8')
  } catch (err) {
    logger.error(`config file not found: "${fileName}"`)
    throw err
  }

  let config
  try {
    config = toml.parse(contents)
  } catch (err) {
    logger.error(`error parsing config file toml: "${fileName}": ${err.message}`)
    throw err
  }

  const fullConfigFileName = path.resolve(fileName)
  return new Config(config, fullConfigFileName)
}

class Config {
  constructor (
    /** @type object */ options,
    /** @type string */ configFileName
  ) {
    const { error, value } = joi.validate(options, ConfigOptionsSchema)
    if (error != null) throw error

    this.host = value.host
    this.port = value.port

    /** @type ICommand[] */
    this.commands = []

    for (let commandOptions of value.commands) {
      this.commands.push(new Command(commandOptions, configFileName))
    }
  }
}

class Command {
  constructor (
    /** @type object */ options,
    /** @type string */ configFileName
  ) {
    const { error, value } = joi.validate(options, CommandOptionsSchema)
    if (error != null) throw error

    for (let key in value.env) value.env[key] = `${value.env[key]}`

    const basePath = path.dirname(configFileName)
    const cwd = utils.resolvePath(basePath, value.cwd)

    this.id = /** @type {string} */ value.id
    this.name = value.name
    this.command = value.command
    this.cwd = cwd
    this.env = value.env
  }
}

const CommandOptionsSchema = joi.object({
  id: joi.string()
    .required()
    .error(new Error('command id [string] is required')),
  name: joi.string()
    .required()
    .error(new Error('command name [string] is required')),
  command: joi.string()
    .required()
    .error(new Error('command command [string] is required')),
  cwd: joi.string()
    .required()
    .error(new Error('command cwd [string] is required')),
  env: joi.object()
    .default({})
    .error(new Error('command env [object] is optional'))
})

const ConfigOptionsSchema = joi.object({
  host: joi.string()
    .default('localhost')
    .error(new Error('host [string] is optional')),
  port: joi.number()
    .default(8080)
    .error(new Error('port [number] is required')),
  commands: joi.array()
    .items(CommandOptionsSchema)
    .required()
    .min(1)
    .error(new Error('commands [Command[]] is required'))
})

// @ts-ignore
if (require.main === module) test()

function test () {
  const fileName = `${__dirname}/../cmd-runner.toml`
  const config = readConfig(fileName)

  console.log(`config for ${fileName}:`, JSON.stringify(config, null, 4))
}
