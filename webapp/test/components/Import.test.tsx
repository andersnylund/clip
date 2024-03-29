import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { default as fetch, default as jestFetchMock } from 'jest-fetch-mock'
import React from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { IMPORT_BOOKMARKS, IMPORT_BOOKMARKS_SUCCESS } from '../../../shared/message-types'
import { getBrowserName } from '../../src/browser'
import { Import, SimpleClip } from '../../src/components/Import'
import { TestProvider, testStore, testDispatch } from '../TestProvider'

jest.mock('../../src/browser', () => ({
  getBrowserName: jest.fn(() => 'Firefox'),
  supportedBrowsers: jest.requireActual('../../src/browser').supportedBrowsers,
}))

const mockSimpleClips: SimpleClip[] = [
  { id: 'id', clips: [], collapsed: false, index: 0, parentId: null, title: 'title', url: 'url' },
]

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

    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

    expect(testStore.getState().importExport).toEqual({
      exportState: 'INITIAL',
      importState: 'INITIAL',
    })

    fireEvent.click(screen.getByText('Import from bookmark bar'))
    fireEvent.click(screen.getByText('Import and overwrite'))
    expect(window.postMessage).toHaveBeenCalledWith({ type: IMPORT_BOOKMARKS }, 'http://localhost/')

    expect(testStore.getState().importExport).toEqual({
      exportState: 'INITIAL',
      importState: 'LOADING',
    })
  })

  it('opens and closes the warning modal', () => {
    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

    fireEvent.click(screen.getByText('Import from bookmark bar'))
    screen.getByText('Import and overwrite')
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Import and overwrie')).not.toBeInTheDocument()
  })

  it('shows loading indicator when waiting for import', () => {
    render(
      <TestProvider preloadedState={{ importExport: { importState: 'LOADING', exportState: 'INITIAL' } }}>
        <Import />
      </TestProvider>
    )

    fireEvent.click(screen.getByText('Import from bookmark bar'))
    screen.getByTestId('loading-spinner')
  })

  it('handles message if correct type', async () => {
    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: IMPORT_BOOKMARKS_SUCCESS, payload: mockSimpleClips },
      })
    )

    await waitFor(() => {
      expect(fetch.mock.calls[0][0]).toEqual('/api/clips/import')
      expect(fetch.mock.calls[0][1]).toEqual({
        body: JSON.stringify([
          { id: 'id', clips: [], collapsed: false, index: 0, parentId: null, title: 'title', url: 'url' },
        ]),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(testStore.getState()).toEqual({
        importExport: {
          exportState: 'INITIAL',
          importState: 'SUCCESS',
        },
        notification: {
          isOpen: true,
          message: 'Bookmarks imported successfully',
          toastType: 'SUCCESS',
        },
      })
      expect(testDispatch).toHaveBeenCalledTimes(2)
      expect(testDispatch).toHaveBeenNthCalledWith(1, expect.anything())
      expect(testDispatch).toHaveBeenNthCalledWith(2, {
        payload: {
          key: 'importState',
          state: 'SUCCESS',
        },
        type: 'importExport/setImportExportState',
      })
    })
  })

  it('shows error toast if import fails', async () => {
    jest.spyOn(window, 'postMessage')
    mocked(fetch).mockResolvedValue({ ok: false } as Response)

    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: IMPORT_BOOKMARKS_SUCCESS, payload: mockSimpleClips },
      })
    )

    await waitFor(() => {
      expect(fetch.mock.calls[0][0]).toEqual('/api/clips/import')
      expect(fetch.mock.calls[0][1]).toEqual({
        body: JSON.stringify([
          { id: 'id', clips: [], collapsed: false, index: 0, parentId: null, title: 'title', url: 'url' },
        ]),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(testStore.getState()).toEqual({
        importExport: {
          exportState: 'INITIAL',
          importState: 'FAILURE',
        },
        notification: {
          isOpen: true,
          message: 'Import failed',
          toastType: 'FAILURE',
        },
      })
      expect(testDispatch).toHaveBeenCalledTimes(2)
      expect(testDispatch).toHaveBeenNthCalledWith(1, expect.anything())
      expect(testDispatch).toHaveBeenNthCalledWith(2, {
        payload: {
          key: 'importState',
          state: 'FAILURE',
        },
        type: 'importExport/setImportExportState',
      })
    })
  })

  it('does not handle message if wrong message type', async () => {
    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

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

    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: IMPORT_BOOKMARKS_SUCCESS, payload: mockSimpleClips },
      })
    )

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clips/import', expect.anything())
    })
  })

  it('shows browser not supported', async () => {
    mocked(getBrowserName).mockReturnValue('Safari')

    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Import />
      </TestProvider>
    )

    fireEvent.click(screen.getByText('Import from bookmark bar'))

    await waitFor(() => {
      screen.getByText(/Only Firefox, Chrome and Brave are currently supported/)
    })

    fireEvent.click(screen.getByText('Close'))
    await waitFor(() => {
      expect(screen.queryByText(/Only Firefox, Chrome and Brave are currently supported/)).not.toBeInTheDocument()
    })
    expect(window.postMessage).not.toHaveBeenCalled()
  })
})
