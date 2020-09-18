import { fireEvent, render, screen } from '@testing-library/react'
import { useSession, signOut, signIn } from 'next-auth/client'

import { Header } from '../../src/components/Header'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
  signIn: jest.fn(),
}))

describe('<Header />', () => {
  beforeEach(jest.resetAllMocks)

  it('renders session user name if user is logged in', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: { name: 'name' } }])

    render(<Header />)
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('renders when user is not logged in', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([false])

    render(<Header />)
    expect(screen.getByText('Sign in')).toBeInTheDocument()
  })

  it('calls signOut on sign out click', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: { name: 'name' } }])

    render(<Header />)
    fireEvent.click(screen.getByText('Sign out'))
    expect(signOut).toHaveBeenCalled()
  })

  it('calls signIn on sign out click', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([undefined])

    render(<Header />)
    fireEvent.click(screen.getByText('Sign in'))
    expect(signIn).toHaveBeenCalled()
  })
})
