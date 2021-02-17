import { getBrowserName } from '../src/browser'

describe('browser', () => {
  it('gets the current browser name', () => {
    expect(getBrowserName()).toEqual('WebKit')
  })
})
