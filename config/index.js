// @flow

/*::
import type { PenthouseOptions } from './defaults'
*/

import defaults from './defaults'

const handler/*: any */ = {
  get: (
    options/*: any */,
    name/*: any */
  ) => {
    const cast/*: any */=
      options[name] && options[name].cast || null
    return cast
      ? cast(options[name].value)
      : options[name].value
  }
  // getOwnPropertyDescriptor: (
  //   options/*: any */,
  //   prop/*: string */
  // )/*: any */ => ({
  //   ...Object.getOwnPropertyDescriptor(options, prop),
  //   ...Array(prop in options)[0] && { value: options[prop], enumerable: true }
  // })
}

const normalizedOptions = new Proxy(defaults, handler)

const getOptions =
  (opts/*:: : PenthouseOptions */)/*: { [string]: mixed } */ =>
    ({ ...normalizedOptions, ...opts })

module.exports = { getOptions }
