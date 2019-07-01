'use strict'

module.exports = {
  getRunner
}

function getRunner () {
  return new Runner()
}

class Runner {
  constructor () {
    /** @type  */
    this._processes = []
  }

  run () {

  }

  get processes () {
    return this._processes
  }
}
