'use strict'

module.exports = {
  createLogger,
  setDebugLogLevel
}

let LogLevelDebug
setDebugLogLevel(process.env.DEBUG)

const path = require('path')

const chalk = require('chalk')

const pkg = require('../package.json')

const ProjectRoot = path.resolve(__dirname, '..')

function createLogger (fileName) {
  fileName = path.relative(ProjectRoot, fileName)
  return new Logger(fileName)
}

function setDebugLogLevel (aBoolean) {
  LogLevelDebug = !!aBoolean
}

const Colors = {
  // @ts-ignore
  debug: chalk.bgBlue.white,
  info: (string) => string,
  // @ts-ignore
  warn: chalk.bgYellow.black,
  // @ts-ignore
  error: chalk.bgRed.white
}

const Prefixes = {
  debug: ['[DEBUG]', ''],
  info: ['[INFO]', ' '],
  warn: ['[WARN]', ' '],
  error: ['[ERROR]', '']
}

class Logger {
  constructor (fileName) {
    this._fileName = fileName
  }

  /** @returns string */
  get fileName () { return this._fileName }

  /** @param {string} [message] - message to log */
  debug (message) { this._log('debug', message) }

  /** @param {string} [message] - message to log */
  info (message) { this._log('info', message) }

  /** @param {string} [message] - message to log */
  warn (message) { this._log('warn', message) }

  /** @param {string} [message] - message to log */
  error (message) { this._log('error', message) }

  _log (level, message) {
    if (level === 'debug') {
      if (!LogLevelDebug) return
      message = `${this.fileName} - ${message}`
    }

    const prefix = `${Colors[level](Prefixes[level][0])}${Prefixes[level][1]}`
    console.log(`${prefix} ${pkg.name}: ${message}`)
  }
}

// @ts-ignore
if (require.main === module) test()

function test () {
  const logger = createLogger(__filename)

  logger.debug('a debug message')
  logger.info('an info message')
  logger.warn('a warn message')
  logger.error('an error message')

  setDebugLogLevel(true)

  logger.debug('a debug message')
  logger.info('an info message')
  logger.warn('a warn message')
  logger.error('an error message')
}
