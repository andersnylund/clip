import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, signOut, useSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils/index'
import { useProfile } from '../../../shared/hooks/useProfile'
import { Header } from '../../src/components/Header'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn(),
}))

jest.mock('../../../shared/hooks/useProfile')

const mockProfile: ReturnType<typeof useProfile> = {
  isLoading: false,
  profile: {
    clips: [],
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
    mockUseSession.mockReturnValue([null, false])

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
    mockUseSession.mockReturnValue([null, false])

    render(<Header />)
    fireEvent.click(screen.getByText('Sign in'))
    expect(signIn).toHaveBeenCalled()
  })
})
