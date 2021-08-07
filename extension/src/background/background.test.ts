import { browser } from 'webextension-polyfill-ts'
import './background'
import { exportListener } from './export'
import { importListener } from './import'

jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    runtime: {
      onMessage: {
        addListener: jest.fn(),
      },
    },
  },
}))

describe('background.ts', () => {
  it('adds event listener to browser runtime onMessage', () => {
    const addListenerMock = browser.runtime.onMessage.addListener
    expect(addListenerMock).toHaveBeenCalledTimes(2)
    expect(addListenerMock).nthCalledWith(1, exportListener)
    expect(addListenerMock).nthCalledWith(2, importListener)
  })
})
