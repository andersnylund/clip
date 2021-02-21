import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import React from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { getBrowserName } from '../../src/browser'
import { Import } from '../../src/components/Import'
import { isSiteEnvDev } from '../../src/hooks/usePublicRuntimeConfig'
import { firefoxRootBookmark, rootChromeBookmark } from '../pages/clips/mock-objects'

jest.mock('../../src/hooks/usePublicRuntimeConfig', () => ({
  isSiteEnvDev: jest.fn(() => true),
}))

jest.mock('../../src/browser', () => ({
  getBrowserName: jest.fn(() => 'Firefox'),
  supportedBrowsers: jest.requireActual('../../src/browser').supportedBrowsers,
}))

describe('<Import />', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
    jestFetchMock.enableMocks()
  })

  beforeEach(jestFetchMock.mockClear)

  afterAll(jestFetchMock.disableMocks)

  it('shows the message when SITE_ENV is dev', () => {
    render(<Import />)

    screen.getByText('Import bookmarks from bookmark bar')
  })

  it('does not show a message when SITE_ENV is prod', () => {
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(false)

    render(<Import />)

    expect(screen.queryByText('Import bookmarks from bookmark bar')).not.toBeInTheDocument()
  })

  it('calls postMessage on import click', () => {
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)

    jest.spyOn(window, 'postMessage')

    render(<Import />)

    fireEvent.click(screen.getByText('Import bookmarks from bookmark bar'))
    expect(window.postMessage).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS' }, 'http://localhost/')
  })

  it('handles message if correct type', async () => {
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)

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
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)

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
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)
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
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)
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
})
