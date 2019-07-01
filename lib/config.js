'use strict'

const fs = require('fs')
const path = require('path')

const joi = require('@hapi/joi')
const toml = require('toml')

const utils = require('./utils')
const logger = require('./logger').createLogger(__filename)

module.exports = {
  readConfig
}

/** @param {string} fileName */
/** @returns {Config} */
function readConfig (fileName) {
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

const CommandOptionsSchema = joi.object({
  id: joi.string().required().error(new Error('command id [string] is required')),
  name: joi.string().required().error(new Error('command name [string] is required')),
  command: joi.string().required().error(new Error('command command [string] is required')),
  cwd: joi.string().required().error(new Error('command cwd [string] is required')),
  env: joi.object().default({}).error(new Error('command env [object] is optional'))
})

class Command {
  /** @param {object} options */
  /** @param {string} configFileName */
  constructor (options, configFileName) {
    const { error, value } = joi.validate(options, CommandOptionsSchema)
    if (error != null) throw error

    for (let key in this._env) this._env[key] = `${this._env[key]}`

    const basePath = path.dirname(configFileName)
    const cwd = utils.resolvePath(basePath, value.cwd)

    /** @type {string} */
    this._id = value.id
    /** @type {string} */
    this._name = value.name
    /** @type {string} */
    this._command = value.command
    /** @type {string} */
    this._cwd = cwd
    /** @type {Record<string, string>} */
    this._env = value.env
  }

  get id () { return this._id }
  get name () { return this._name }
  get command () { return this._command }
  get cwd () { return this._cwd }
  get env () { return this._env }

  toJSON () {
    return {
      id: this.id,
      name: this.name,
      command: this.command,
      cwd: this.cwd,
      env: this.env
    }
  }
}

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

class Config {
  /** @param {object} options */
  /** @param {string} configFileName */
  constructor (options, configFileName) {
    const { error, value } = joi.validate(options, ConfigOptionsSchema)
    if (error != null) throw error

    /** @type {string} */
    this._host = value.host
    /** @type {number} */
    this._port = value.port
    /** @type {Command[]} */
    this._commands = []

    for (let commandOptions of value.commands) {
      this._commands.push(new Command(commandOptions, configFileName))
    }
  }

  get host () { return this._host }
  get port () { return this._port }
  get commands () { return this._commands }

  toJSON () {
    return {
      host: this.host,
      port: this.port,
      commands: this.commands
    }
  }
}

module.exports.Config = Config

// @ts-ignore
if (require.main === module) test()

function test () {
  const fileName = `${__dirname}/../cmd-runner.toml`
  const config = readConfig(fileName)

  console.log(`config for ${fileName}:`, JSON.stringify(config, null, 4))
}
