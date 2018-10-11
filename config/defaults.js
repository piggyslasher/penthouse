// @flow
const parseIntRadixed = (
  args /*: number */,
  radix /*: number */ = 10
)/*: number */ => parseInt(args, radix)

/*::
type Option = {
  command: string,
  desc: string,
  value?: mixed,
  cast?: function
}
*/

/*::
export type PenthouseOptions = {
  url: Option,
  cssString: Option,
  css: Option,
  width: Option,
  height: Option,
};
*/

// Regarding abbreviates and camelCase https://www.approxion.com/?p=303
const penthouseOptions /*: PenthouseOptions */ = {
  url: {
    command: '-u, --url',
    desc: 'Accessible url. Use file:/// protocol for local html files'
  },
  unstableKeepBrowserAlive: false,
  cssString: {
    command: '-C, --css-string',
    desc: 'Original css to extract critical css from'
  },
  css: {
    command: '-c, --css',
    desc: 'Path to original css file on disk (if using instead of cssString)'
  },
  width: {
    command: '-w, --width <n>',
    desc: 'Width for critical viewport (default 1300)',
    value: 1300,
    cast: parseIntRadixed
  },
  height: {
    command: '-h, --height <n>',
    desc: 'Height for critical viewport (default 900)',
    value: 900,
    cast: parseIntRadixed
  },
  screenshot: {
    command: '-s, --screenshot <n>',
    desc: 'Configuration for screenshots (not used by default). See Screenshot example'
  },
  keepLargerMeduaQueries: {
    command: '-M, --keep-larger-media-queries',
    desc: 'Keep media queries even for width/height values larger than critical viewport',
    value: false
  },
  forceInclude: {
    command: '-F, --force-include <list>',
    desc: 'Array of css selectors to keep in critical css, even if not appearing in critical viewport. Strings or regex (f.e. [\'.keepMeEvenIfNotSeenInDom\', /^.button/])',
    value: []
  },
  propertiesToRemove: {
    command: '-R, --properties-to-remove <list>',
    desc: 'Css properties to filter out from critical css',
    value: [
      '(.*)transition(.*)',
      'cursor',
      'pointer-events',
      '(-webkit-)?tap-highlight-color',
      '(.*)user-select'
    ]
  },
  timeout: {
    command: '-t, --timeout',
    desc: 'abort critical CSS generation after this time',
    value: 30000,
    cast: parseIntRadixed
  },
  puppeteer: {
    command: '-P, --puppeteer',
    desc: 'Settings for puppeteer. See Custom puppeteer browser example'
  },
  pageLoadSkipTimeout: {
    command: '-T, --page-load-skip-timeout',
    desc: 'stop waiting for page load after this time (for sites when page load event is unreliable)'
  },
  renderWaitTime: {
    command: '-r, --render-wait-time',
    desc: 'wait time after page load before critical css extraction starts',
    value: 100,
    cast: parseIntRadixed
  },
  blockJsRequests: {
    command: '-b, --block-js-requests',
    desc: 'set to false to load JS (not recommended)',
    value: true
  },
  maxEmbeddedBase64Length: {
    command: '-m, --max-embedded-base64-length',
    desc: 'characters; strip out inline base64 encoded resources larger than this',
    value: 1000,
    cast: parseIntRadixed
  },
  maxElementsToCheckSelector: {
    command: '-e, --max-elements-to-check-per-selector',
    desc: 'Can be specified to limit nr of elements to inspect per css selector, reducing execution time',
    value: undefined
  },
  userAgent: {
    command: '-U, --user-agent',
    desc: 'specify which user agent string when loading the page',
    value: 'Penthouse Critical Path CSS Generator'
  },
  customPageHeaders: {
    command: '-H, --custom-page-headers',
    desc: 'Set extra http headers to be sent with the request for the url'
  },
  strict: {
    command: '-S, --strict',
    desc: 'Make Penthouse throw on errors parsing the original CSS. Legacy option, not recommended',
    value: false
  }
}

export default penthouseOptions
