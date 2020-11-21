import { render, screen, waitFor } from '@testing-library/react'
import jestMockFetch from 'jest-fetch-mock'
import { useSession, Session } from 'next-auth/client'
import { ReactChildren } from 'react'
import { useProfile } from '../../src/hooks/useProfile'

import Profile from '../../src/pages/profile'
import { User } from '../../src/types'

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { image: 'image', name: 'name' } } as Session, false]),
}))

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(),
}))

// https://github.com/vercel/next.js/issues/16864#issuecomment-702069418
jest.mock('next/link', () => ({ children }: { children: ReactChildren }) => children)

const mockUser: User = {
  folders: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username123',
}

describe('profile page', () => {
  afterEach(() => {
    jestMockFetch.resetMocks()
  })

  it('renders logged in user', async () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: mockUser })
    render(<Profile />)
    await waitFor(() => {
      screen.getByText(/clips\/username123/)
      screen.getByText(/Your username is used to create a link to your public profile/)
    })
  })

  it('renders empty page if user has no session', async () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([undefined])
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: mockUser })
    const { container } = render(<Profile />)
    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('renders username modal only when profile is loaded and it has no username', async () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: { image: 'image', name: 'name' } } as Session, false])

    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: { ...mockUser, username: null } })

    render(<Profile />)
    await waitFor(() => {
      screen.getByText(/Set an username for yourself/)
      expect(
        screen.queryByText(/Your username is used to create a link to your public profile/)
      ).not.toBeInTheDocument()
    })
  })

  it('shows an alt text if user image is not found', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' } } as Session, false])
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: mockUser })
    render(<Profile />)
    expect(screen.getByAltText('Profile')).not.toHaveAttribute('src')
  })
})
