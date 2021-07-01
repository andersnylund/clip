import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestMockFetch from 'jest-fetch-mock'
import { Session } from 'next-auth'
import { mutate, SWRConfig } from 'swr'
import { UsernamePrompt } from '../../src/components/UsernamePrompt'
import { User } from '../../src/types'

const mockUser: User = {
  clips: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username123',
}

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

describe('<UsernamePrompt />', () => {
  beforeAll(jestMockFetch.enableMocks)

  it('updates the username', async () => {
    jestMockFetch.doMockIf('/api/profile', JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <UsernamePrompt defaultOpen={true} />
      </SWRConfig>
    )
    await waitFor(() => {
      screen.getByDisplayValue(/username123/)
    })
    fireEvent.change(screen.getAllByPlaceholderText('Username')[0], { target: { value: 'hehe' } })

    fireEvent.click(screen.getByText('Set'))

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
        <UsernamePrompt defaultOpen={true} />
      </SWRConfig>
    )
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Username')[0]).toHaveValue('')
    })
  })

  it('does not show the input by default', async () => {
    jestMockFetch.doMockIf('/api/profile', JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <UsernamePrompt />
      </SWRConfig>
    )
    await waitFor(() => {
      expect(screen.getByText('username123'))
      expect(screen.queryByText('Username')).not.toBeInTheDocument()
    })
  })

  it('opens the input on click', async () => {
    jestMockFetch.doMockIf('/api/profile', JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <UsernamePrompt />
      </SWRConfig>
    )
    fireEvent.click(screen.getByText('username123'))
    await waitFor(() => {
      expect(screen.getAllByPlaceholderText('Username')[0]).toHaveValue('username123')
    })
  })
})
