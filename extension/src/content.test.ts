import { chrome } from 'jest-chrome'

import { handleEvent } from './content'

describe('content.ts', () => {
  it('handles the correct window postMessage event', (done) => {
    const postMessageSpy = jest.spyOn(window, 'postMessage')

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chrome.runtime.sendMessage = (message: { type: string }, callback: (paylaod: string) => void) => {
      expect(message).toEqual({ type: 'IMPORT_BOOKMARKS' })
      callback('test payload')
      expect(postMessageSpy).toHaveBeenCalledWith(
        {
          payload: 'test payload',
          type: 'IMPORT_BOOKMARKS_SUCCESS',
        },
        'http://localhost/'
      )
      done()
    }
    handleEvent({ data: { type: 'IMPORT_BOOKMARKS' } } as MessageEvent)
  })

  it('does not handle if message event type does not match', () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    chrome.runtime.sendMessage = jest.fn()
    handleEvent({ data: { type: 'SOME_OTHER_MESSAGE_TYPE' } } as MessageEvent)
    expect(chrome.runtime.sendMessage).not.toHaveBeenCalled()
  })
})
