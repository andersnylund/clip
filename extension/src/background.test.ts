import { chrome } from 'jest-chrome'
import './background'

describe('background.ts', () => {
  it('adds event listener to chrome runtime', () => {
    expect(chrome.runtime.onMessage.hasListeners()).toBe(true)
  })

  it('handles the message', (done) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chrome.bookmarks.getTree = (callback: (payload: string) => void) => {
      callback('this is a test')
    }

    const sendResponse = jest.fn().mockImplementation((payload) => {
      expect(payload).toEqual('this is a test')
      done()
    })

    chrome.runtime.onMessage.callListeners({ type: 'IMPORT_BOOKMARKS' }, {}, sendResponse)
  })

  it("doesn't handle the message if message type something else", () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chrome.bookmarks.getTree = (callback: (payload: string) => void) => {
      callback('this is a test')
    }

    const sendResponse = jest.fn().mockImplementation((payload) => {
      expect(payload).toEqual('this is a test')
    })

    chrome.runtime.onMessage.callListeners({ type: 'IMPORT_BOOKMARKS_SUCCESS' }, {}, sendResponse)
  })
})
