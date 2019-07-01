'use strict'

const path = require('path')

module.exports = {
  isRootPath,
  resolvePath,
  createDeferred
}

/** @param {string} spec */
function isRootPath (spec) {
  if (spec.startsWith('/')) return true
  if (spec.match(/^.:/)) return true

  return false
}

/** @param {string} base */
/** @param {string} spec */
function resolvePath (base, spec) {
  if (isRootPath(spec)) return spec

  return path.resolve(base, spec)
}

function createDeferred () {
  let resolver
  let rejecter

  const promise = new Promise((resolve, reject) => {
    resolver = resolve
    rejecter = reject
  })

  return {
    promise,
    resolve: resolver,
    reject: rejecter
  }
}

// @ts-ignore
if (require.main === module) test()

async function test () {
  const deferred = createDeferred()
  setTimeout(deferred.resolve, 2000)
  console.log('waiting')
  await deferred.promise
  console.log('waited')
}