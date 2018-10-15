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

    console.log(config)

    expect(config.url).toEqual(providedOptions.url)
    expect(config.width).toEqual(providedOptions.width)
    expect(config.height).toEqual(defaultConfig.height.value)
  })

  it('should cast px value to int', () => {
    const providedOptions = {
      width: '400px',
      height: '1'
    }

    const config = getOptions(providedOptions)

    expect(config.width).toEqual(400)
    expect(config.height).toEqual(1)
  })
})
