import fs from 'fs'
import debug from 'debug'

import generateCriticalCss from './core'
import {
  browserIsRunning,
  closeBrowser,
  closeBrowserPage,
  getOpenBrowserPage,
  launchBrowserIfNeeded,
  restartBrowser
} from './browser'

import getOptions from '../config'

const debuglog = debug('penthouse')

function exitHandler (exitCode) {
  closeBrowser({ forceClose: true })
  process.exit(typeof exitCode === 'number' ? exitCode : 0)
}

function readFilePromise (filepath, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, encoding, (err, content) => {
      if (err) {
        return reject(err)
      }
      resolve(content)
    })
  })
}

function prepareForceIncludeForSerialization (forceInclude = []) {
  // need to annotate forceInclude values to allow RegExp to pass through JSON serialization
  return forceInclude.map((forceIncludeValue) => {
    if (
      typeof forceIncludeValue === 'object' &&
      forceIncludeValue.constructor.name === 'RegExp'
    ) {
      return {
        type: 'RegExp',
        source: forceIncludeValue.source,
        flags: forceIncludeValue.flags
      }
    }
    return { value: forceIncludeValue }
  })
}

// const so not hoisted, so can get regeneratorRuntime inlined above, needed for Node 4
const generateCriticalCssWrapped = async function generateCriticalCssWrapped (
  providedOptions,
  { forceTryRestartBrowser } = {}
) {
  // Merge properties with default ones
  const {
    width,
    height,
    timeout,
    propertiesToRemove,
    forceInclude,
    maxEmbeddedBase64Length,
    ...options
  } = getOptions(providedOptions)

  // always forceInclude '*', 'html', and 'body' selectors;
  // yields slight performance improvement
  const forceIncludePrepared = prepareForceIncludeForSerialization(
    ['*', '*:before', '*:after', 'html', 'body'].concat(
      forceInclude || []
    )
  )

  // promise so we can handle errors and reject,
  // instead of throwing what would otherwise be uncaught errors in node process
  return new Promise(async (resolve, reject) => {
    debuglog('call generateCriticalCssWrapped')
    let formattedCss
    let pagePromise
    try {
      pagePromise = getOpenBrowserPage({
        unstableKeepBrowserAlive: options.unstableKeepBrowserAlive
      })

      formattedCss = await generateCriticalCss({
        pagePromise,
        url: options.url,
        cssString: options.cssString,
        width,
        height,
        forceIncludePrepared,
        strict: options.strict,
        userAgent: options.userAgent,
        renderWaitTime: options.renderWaitTime,
        timeout,
        pageLoadSkipTimeout: options.pageLoadSkipTimeout,
        blockJSRequests: options.blockJSRequests,
        customPageHeaders: options.customPageHeaders,
        screenshots: options.screenshots,
        keepLargerMediaQueries: options.keepLargerMediaQueries,
        maxElementsToCheckPerSelector: options.maxElementsToCheckPerSelector,
        // postformatting
        propertiesToRemove,
        maxEmbeddedBase64Length,
        debuglog,
        unstableKeepBrowserAlive: options.unstableKeepBrowserAlive
      })
    } catch (e) {
      const page = await pagePromise.then(({ returnedPage }) => returnedPage)
      await closeBrowserPage({
        page,
        error: e,
        unstableKeepBrowserAlive: options.unstableKeepBrowserAlive
      })

      const runningBrowswer = await browserIsRunning()
      if (!forceTryRestartBrowser && !runningBrowswer) {
        debuglog(
          `${'Browser unexpecedly not opened - crashed? ' +
            '\nurl: '}${
            options.url
          }\ncss length: ${
            options.cssString.length}`
        )
        await restartBrowser({
          width,
          height,
          getBrowser: options.puppeteer && options.puppeteer.getBrowser
        })
        // retry
        resolve(
          generateCriticalCssWrapped(options, {
            forceTryRestartBrowser: true
          })
        )
        return
      }
      reject(e)
      return
    }

    const page = await pagePromise.then(({ returnedPage }) => returnedPage)
    await closeBrowserPage({
      page,
      unstableKeepBrowserAlive: options.unstableKeepBrowserAlive
    })

    debuglog('generateCriticalCss done')
    if (formattedCss.trim().length === 0) {
      // TODO: would be good to surface this to user, always
      debuglog(`Note: Generated critical css was empty for URL: ${options.url}`)
      resolve('')
      return
    }

    resolve(formattedCss)
  })
}
// @flow
export const penthouseOptions = getOptions({})

export default function (providedOptions, callback) {
  let options = getOptions(providedOptions)

  process.on('exit', exitHandler)
  process.on('SIGTERM', exitHandler)
  process.on('SIGINT', exitHandler)

  return new Promise(async (resolve, reject) => {
    function cleanupAndExit ({ returnValue, error = null }) {
      process.removeListener('exit', exitHandler)
      process.removeListener('SIGTERM', exitHandler)
      process.removeListener('SIGINT', exitHandler)

      closeBrowser({
        unstableKeepBrowserAlive: options.unstableKeepBrowserAlive
      })

      // still supporting legacy callback way of calling Penthouse
      if (callback) {
        callback(error, returnValue)
        return
      }
      if (error) {
        reject(error)
      } else {
        resolve(returnValue)
      }
    }

    // support legacy mode of passing in css file path instead of string
    if (!options.cssString && options.css) {
      try {
        const cssString = await readFilePromise(options.css, 'utf8')
        options = Object.assign({}, options, { cssString })
      } catch (err) {
        debuglog(`error reading css file: ${options.css}, error: ${err}`)
        cleanupAndExit({ error: err })
        return
      }
    }
    if (!options.cssString) {
      debuglog('Passed in css is empty')
      cleanupAndExit({ error: new Error('css should not be empty') })
      return
    }

    const { width, height } = options
    // launch the browser
    await launchBrowserIfNeeded({
      getBrowser: options.puppeteer && options.puppeteer.getBrowser,
      width,
      height
    })
    try {
      const criticalCss = await generateCriticalCssWrapped(options)
      cleanupAndExit({ returnValue: criticalCss })
    } catch (err) {
      cleanupAndExit({ error: err })
    }
  })
}
