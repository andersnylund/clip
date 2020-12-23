import { fireEvent, render, screen } from '@testing-library/react'
import { useSession, signOut, signIn } from 'next-auth/client'
import { mocked } from 'ts-jest/utils/index'

import { Header } from '../../src/components/Header'
import { useProfile } from '../../src/hooks/useProfile'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn(),
}))

jest.mock('../../src/hooks/useProfile')

const mockProfile: ReturnType<typeof useProfile> = {
  isLoading: false,
  profile: {
    folders: [],
    id: 1,
    image: 'profile image',
    name: 'profile name',
    username: 'profile username',
  },
}

describe('<Header />', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([{ user: { name: 'name' }, expires: '', accessToken: '' }, false])
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue(mockProfile)
  })

  it('renders session user name if user is logged in', () => {
    render(<Header />)
    expect(screen.getByText('profile username')).toBeInTheDocument()
  })

  it('renders when user is not logged in', () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([undefined, false])

    render(<Header />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('calls signOut on sign out click', () => {
    render(<Header />)
    fireEvent.click(screen.getByText('Sign out'))
    expect(signOut).toHaveBeenCalled()
  })

  it('calls signIn on sign out click', () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([undefined, false])

    render(<Header />)
    fireEvent.click(screen.getByText('Sign in'))
    expect(signIn).toHaveBeenCalled()
  })
})
