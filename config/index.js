// @flow

/*::
import type { PenthouseOptions, ProvidedOptions, ValidOption } from './defaults';
*/

import defaults from './defaults'

const handler/*: any */ = {
  get: (
    options/*: PenthouseOptions */,
    name/*: any */
  ) => {
    // cast is simple a function that is used to ensure the return type
    // i.e. parseInt can be used in the case of an option that needs to be numeric
    const cast/*: any */=
      options[name] && options[name].cast || null
    return cast
      ? cast(options[name].value)
      : options[name].value
  }
}

/*::
declare type ProxiedOptions = { ...Proxy<PenthouseOptions>, ...ProvidedOptions }
*/

const normalizedOptions /*: ProxiedOptions */ = new Proxy(defaults, handler)

const getOptions =
  (opts/*:: : ?ProxiedOptions */ = normalizedOptions)/*: ProxiedOptions */ =>
    ({ ...normalizedOptions, ...opts })

module.exports = {
  getOptions,
  defaultOptions: (defaults /*: PenthouseOptions */)
}
