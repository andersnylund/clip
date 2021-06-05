import { render } from 'react-dom'
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
  let indexModule: typeof import('./index')

  beforeEach(async () => {
    const module = await import('./index')
    indexModule = module
    jest.resetModules()
  })

  // it('does not render the popup if no active tabs found', async () => {
  //   mocked(browser.tabs.query).mockResolvedValue([])
  //   const mockRender = mocked(render)
  //   await indexModule.start()
  //   expect(mockRender).not.toHaveBeenCalled()
  // })

  it('renders the popup if active tabs found', async () => {
    mocked(browser.tabs.query).mockResolvedValue([
      { active: true, highlighted: true, incognito: false, index: 0, pinned: false },
    ])
    const mockRender = mocked(render)
    await indexModule.start()
    expect(browser.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true })
    expect(mockRender).toHaveBeenCalledTimes(1)
  })
})
