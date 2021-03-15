import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import React from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { getBrowserName } from '../../src/browser'
import { Import } from '../../src/components/Import'
import { firefoxRootBookmark, rootChromeBookmark } from '../pages/clips/mock-objects'

jest.mock('../../src/browser', () => ({
  getBrowserName: jest.fn(() => 'Firefox'),
  supportedBrowsers: jest.requireActual('../../src/browser').supportedBrowsers,
}))

describe('<Import />', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
    jestFetchMock.enableMocks()
  })

  beforeEach(() => {
    jestFetchMock.mockClear()
    jest.spyOn(window, 'postMessage').mockClear()
  })

  afterAll(jestFetchMock.disableMocks)

  it('calls postMessage on import click', () => {
    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent.click(screen.getByText('Import from bookmark bar'))
    fireEvent.click(screen.getByText('Import and overwrite'))
    expect(window.postMessage).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS' }, 'http://localhost/')
  })

  it('opens and closes the warning modal', () => {
    render(<Import />)

    fireEvent.click(screen.getByText('Import from bookmark bar'))
    screen.getByText('Import and overwrite')
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Import and overwrie')).not.toBeInTheDocument()
  })

  it('handles message if correct type', async () => {
    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'IMPORT_BOOKMARKS_SUCCESS', payload: firefoxRootBookmark },
      })
    )

    await waitFor(() => {
      // FIXME: make better tests
      expect(fetch).toHaveBeenCalledWith('/api/clips/import', expect.anything())
    })
  })

  it('does not handle message if wrong message type', async () => {
    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'SOME_OTHER_TYPE', payload: {} },
      })
    )

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  it('handles chrome bookmarks', async () => {
    mocked(getBrowserName).mockReturnValue('Chrome')

    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'IMPORT_BOOKMARKS_SUCCESS', payload: rootChromeBookmark },
      })
    )

    await waitFor(() => {
      // FIXME: make better tests
      expect(fetch).toHaveBeenCalledWith('/api/clips/import', expect.anything())
    })
  })

  it('does not import if nothing is found', async () => {
    mocked(getBrowserName).mockReturnValue('Chrome')

    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'IMPORT_BOOKMARKS_SUCCESS', payload: {} },
      })
    )

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled()
    })
  })

  it('shows browser not supported', async () => {
    mocked(getBrowserName).mockReturnValue('Safari')

    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent.click(screen.getByText('Import from bookmark bar'))

    await waitFor(() => {
      screen.getByText(/Only Firefox and Chrome are currently supported/)
    })

    fireEvent.click(screen.getByText('Close'))
    await waitFor(() => {
      expect(screen.queryByText(/Only Firefox and Chrome are currently supported/)).not.toBeInTheDocument()
    })
    expect(window.postMessage).not.toHaveBeenCalled()
  })
})
