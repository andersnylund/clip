import { supportedBrowsers, getBrowserName } from './browser'

describe('browser.ts', () => {
  it('supports the correct browsers', () => {
    expect(supportedBrowsers).toEqual(['Firefox', 'Chrome'])
  })

  it('gets the browser name', () => {
    expect(getBrowserName()).toEqual('WebKit')
  })
})
