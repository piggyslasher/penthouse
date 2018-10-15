// @flow

/*::
import type { PenthouseOptions, ProvidedOptions, ValidOption } from './defaults';
*/

import defaults from './defaults'

const handler/*: any */ = {
  get: (
    options/*: ProvidedOptions */,
    name/*: ValidOption */
  ) => {
    // cast is simple a function that is used to ensure the return type
    // i.e. parseInt can be used in the case of an option that needs to be numeric
    const cast/*: any */=
      defaults[name] && defaults[name].cast || null
    const value = options[name] || (defaults[name] && defaults[name].value)

    return cast
      ? cast(value)
      : value
  }
}

/*::
declare type ProxiedOptions = { ...Proxy<PenthouseOptions>, ...ProvidedOptions }
*/

const getOptions =
  (opts/*:: : ?ProxiedOptions */ = {})/*: ProxiedOptions */ =>
    new Proxy(opts, handler)

module.exports = {
  getOptions,
  defaultOptions: (defaults /*: PenthouseOptions */)
}
