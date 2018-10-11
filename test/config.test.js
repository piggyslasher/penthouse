import defaultConfig from '../config/defaults'
import { getOptions } from '../config'

describe('Configuration', () => {
  it('should load the config properly', () => {
    const config = getOptions({})
    console.log(config, defaultConfig)
    expect(config).toBeTruthy()
  })
  it('should return a new value if passed in the options', () => {
    const providedOptions = {
      url: 'https://google.com',
      width: 1001
    }
    const config = getOptions(
      providedOptions
    )

    console.log(defaultConfig, config)
    debugger

    expect(config.url).toEqual(providedOptions.url)
    expect(config.width).toEqual(providedOptions.width)
    expect(config.height).toEqual(defaultConfig.height.value)
  })
})
