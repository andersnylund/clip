import { mocked } from 'ts-jest/utils'
import { browser } from 'webextension-polyfill-ts'

jest.mock('react-dom')
jest.mock('webextension-polyfill-ts', () => ({
  browser: {
    tabs: {
      query: jest.fn(),
    },
  },
}))

describe('index.tsx', () => {
  beforeEach(() => {
    mocked(browser.tabs.query).mockClear()
    jest.isolateModules(async () => {
      await require('./index')
    })
  })

  it('renders the popup if active tabs found', async () => {
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 0, pinned: false },
    ])
    await require('./index')
    expect(browser.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true })
  })

  it('does not render the popup if no active tabs found', async () => {
    mocked(browser.tabs.query).mockResolvedValue([])
    await require('./index')
    expect(browser.tabs.query).not.toHaveBeenCalled()
  })
})
