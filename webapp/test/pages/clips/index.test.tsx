import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React, { Children } from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../../src/hooks/useProfile'
import { isSiteEnvDev } from '../../../src/hooks/usePublicRuntimeConfig'
import ClipIndex from '../../../src/pages/clips/index'
import { User } from '../../../src/types'
import { rootBookmark } from './mock-objects'

jest.mock('../../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(),
}))

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { name: 'name' } }, false]),
}))

jest.mock('../../../src/hooks/usePublicRuntimeConfig', () => ({
  isSiteEnvDev: jest.fn(() => true),
}))

jest.mock('next/link', () => ({ children }: { children: typeof Children }) => children)

const mockProfile: User = {
  clips: [
    {
      id: 'folderId1',
      clips: [],
      title: 'folderName1',
      index: 0,
      parentId: null,
      url: null,
      userId: 0,
    },
  ],
  id: 0,
  image: 'image',
  name: 'name',
  username: 'username',
}

jest.mock('../../../src/browser', () => ({
  getBrowserName: jest.fn(() => 'Firefox'),
  supportedBrowsers: jest.requireActual('../../../src/browser').supportedBrowsers,
}))

describe('index.ts', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
  })

  beforeEach(() => {
    mocked(fetch).mockClear()
  })

  it('renders profile folder list and add folder', () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })
    render(<ClipIndex />)

    screen.getByText('Add folder')
    screen.getByText('folderName1')
  })

  it('does not render profile folder list or add folder if no user', () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: undefined, isLoading: false })
    render(<ClipIndex />)

    expect(screen.queryByText('Add folder')).not.toBeInTheDocument()
    expect(screen.queryByText('folderName1')).not.toBeInTheDocument()
  })

  it('shows the message when SITE_ENV is dev', () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })
    render(<ClipIndex />)

    screen.getByText('Import bookmarks from bookmark bar')
  })

  it('does not show a message when SITE_ENV is prod', () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })

    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(false)

    render(<ClipIndex />)

    expect(screen.queryByText('Import bookmarks from bookmark bar')).not.toBeInTheDocument()
  })

  it('calls postMessage on import click', () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)

    jest.spyOn(window, 'postMessage')

    render(<ClipIndex />)

    fireEvent.click(screen.getByText('Import bookmarks from bookmark bar'))
    expect(window.postMessage).toHaveBeenCalledWith({ type: 'IMPORT_BOOKMARKS' }, 'http://localhost/')
  })

  it('handles message if correct type', async () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)

    jest.spyOn(window, 'postMessage')

    render(<ClipIndex />)

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'IMPORT_BOOKMARKS_SUCCESS', payload: rootBookmark },
      })
    )

    await waitFor(() => {
      // FIXME: make better tests
      expect(fetch).toHaveBeenCalledWith('/api/clips/import', expect.anything())
    })
  })

  it('does not handle message if wrong message type', async () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })
    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(true)

    jest.spyOn(window, 'postMessage')

    render(<ClipIndex />)

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
})
