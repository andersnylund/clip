import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestMockFetch from 'jest-fetch-mock'
import { useSession, Session } from 'next-auth/client'
import { mutate, SWRConfig } from 'swr'

import Profile from '../../src/pages/profile'
import { User } from '../../src/types'

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { image: 'image', name: 'name' } } as Session, false]),
}))

jest.mock('swr', () => ({
  __esModule: true,
  mutate: jest.fn(),
  default: jest.requireActual('swr').default,
  SWRConfig: jest.requireActual('swr').SWRConfig,
}))

const mockUser: User = {
  clips: [],
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
    jestMockFetch.doMockIf('/api/profile', JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Profile />
      </SWRConfig>
    )
    await waitFor(() => {
      screen.getByText(/clips\/username123/)
    })
  })

  it('updates the username', async () => {
    jestMockFetch.doMockIf('/api/profile', JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Profile />
      </SWRConfig>
    )
    await waitFor(() => {
      screen.getByText(/clips\/username123/)
    })
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'hehe' } })

    expect(screen.getByLabelText('Username')).toHaveValue('hehe')

    fireEvent.click(screen.getByText('Update'))

    await waitFor(() => {
      expect(jestMockFetch).toHaveBeenNthCalledWith(2, '/api/profile', {
        body: '{"username":"hehe"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
    })

    expect(mutate).toHaveBeenCalledWith('/api/profile')
  })

  it('sets empty username if profile username is null', async () => {
    jestMockFetch.doMockIf('/api/profile', JSON.stringify({ ...mockUser, username: null }))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Profile />
      </SWRConfig>
    )
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toHaveValue('')
    })
  })

  it('renders empty page if user is no session', async () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([undefined])
    jestMockFetch.doMockIf('/api/profile', JSON.stringify(mockUser))
    const { container } = render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Profile />
      </SWRConfig>
    )
    expect(container).toMatchInlineSnapshot(`<div />`)
  })
})
