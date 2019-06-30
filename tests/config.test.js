'use strict'

/* global test, expect */

const path = require('path')

const Config = require('../lib/config')
const FixturePath = path.resolve(__dirname, 'fixtures')
const Cwd = `${FixturePath}/config`

test('can read a correct file', () => {
  const config = Config.readConfig(`${FixturePath}/config/2-commands.toml`)
  const expected = {
    host: 'localhost',
    port: 8080,
    commands: [
      { id: 'npm-test', name: 'npm test', command: 'npm test', cwd: Cwd },
      { id: 'ls', name: 'list files', command: 'ls', cwd: Cwd }
    ]
  }
  expect(config).toMatchObject(expected)
})

test('uses default when host is missing', () => {
  const config = Config.readConfig(`${FixturePath}/config/no-host.toml`)
  const expected = {
    host: 'localhost',
    port: 8080,
    commands: [
      { id: 'npm-test', name: 'npm test', command: 'npm test', cwd: Cwd }
    ]
  }
  expect(config).toMatchObject(expected)
})

test('uses default when port is missing', () => {
  const config = Config.readConfig(`${FixturePath}/config/no-port.toml`)
  const expected = {
    host: 'localhost',
    port: 8080,
    commands: [
      { id: 'npm-test', name: 'npm test', command: 'npm test', cwd: Cwd }
    ]
  }
  expect(config).toMatchObject(expected)
})

test('throws when commands is missing', () => {
  function readConfig () {
    Config.readConfig(`${FixturePath}/config/no-commands.toml`)
  }

  expect(readConfig).toThrow(/commands/)
})

test('throws when commands is empty', () => {
  function readConfig () {
    Config.readConfig(`${FixturePath}/config/0-commands.toml`)
  }

  expect(readConfig).toThrow(/commands/)
})
