import { render, screen } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import React, { Children } from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../src/hooks/useProfile'
import ClipIndex from '../../src/pages/clips'
import { User } from '../../src/types'

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(),
}))

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { name: 'name' } }, false]),
}))

jest.mock('../../src/hooks/usePublicConfig', () => ({
  isSiteEnvDev: jest.fn(() => true),
}))

jest.mock('next/link', () => ({ children }: { children: typeof Children }) => children)

jest.mock('../../src/browser', () => ({
  getBrowserName: jest.fn(() => 'Firefox'),
  supportedBrowsers: jest.requireActual('../../src/browser').supportedBrowsers,
}))

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

describe('index.ts', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
    jestFetchMock.enableMocks()
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
})
