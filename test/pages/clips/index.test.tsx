import React from 'react'
import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'

import { useProfile } from '../../../src/hooks/useProfile'
import ClipIndex from '../../../src/pages/clips/index'
import { User } from '../../../src/types'
import { isSiteEnvDev } from '../../../src/hooks/usePublicRuntimeConfig'

jest.mock('../../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(),
}))

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { name: 'name' } }, false]),
}))

jest.mock('../../../src/hooks/usePublicRuntimeConfig', () => ({
  isSiteEnvDev: jest.fn(() => true),
}))

const mockProfile: User = {
  folders: [
    {
      id: 'folderId1',
      clips: [],
      name: 'folderName1',
    },
  ],
  id: 0,
  image: 'image',
  name: 'name',
  username: 'username',
}

describe('index.ts', () => {
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

    screen.getByText('This should be hidden in production')
  })

  it('does not show a message when SITE_ENV is prod', () => {
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({ profile: mockProfile, isLoading: false })

    const mockIsSiteEnvDev = mocked(isSiteEnvDev)
    mockIsSiteEnvDev.mockReturnValue(false)

    render(<ClipIndex />)

    expect(screen.queryByText('This should be hidden in production')).not.toBeInTheDocument()
  })
})
