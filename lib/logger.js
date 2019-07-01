'use strict'

module.exports = {
  createLogger,
  setDebug: setDebug
}

const path = require('path')
const chalk = require('chalk')
const pkg = require('../package.json')

/** @typedef { import('./types').ILogger } ILogger */

let Debug = false
const ProjectRoot = path.resolve(__dirname, '..')

/** @type {(fileName: string) => ILogger} */
function createLogger (fileName) {
  fileName = path.relative(ProjectRoot, fileName)
  return new Logger(fileName)
}

/** @type {(value: boolean) => void} */
function setDebug (value) {
  Debug = !!value
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

  debug (message) { this._log('debug', message) }
  info (message) { this._log('info', message) }
  warn (message) { this._log('warn', message) }
  error (message) { this._log('error', message) }

  _log (level, message) {
    if (level === 'debug') {
      if (!Debug) return
      message = `${this._fileName} - ${message}`
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

  setDebug(true)

  logger.debug('a debug message')
  logger.info('an info message')
  logger.warn('a warn message')
  logger.error('an error message')
}
