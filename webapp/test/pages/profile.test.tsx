import { render, screen, waitFor } from '@testing-library/react'
import jestMockFetch from 'jest-fetch-mock'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/client'
import { NextRouter, useRouter } from 'next/router'
import { Children } from 'react'
import { SWRConfig } from 'swr'
import { mocked } from 'ts-jest/utils'
import { User } from '../../../shared/types'
import { isSiteEnvDev } from '../../src/hooks/usePublicConfig'
import Profile from '../../src/pages/profile'
import { TestProvider } from '../TestProvider'

jest.mock('../../src/hooks/usePublicConfig')

jest.mock('next/router', () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
}))

jest.mock(
  'next/link',
  () =>
    ({ children }: { children: typeof Children }) =>
      children
)

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
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username123',
  syncEnabled: false,
  syncId: null,
}

describe('profile page', () => {
  beforeAll(jestMockFetch.enableMocks)

  afterEach(() => {
    jestMockFetch.resetMocks()
  })

  it('renders logged in user', async () => {
    jestMockFetch.doMockIf('http://localhost:3001/api/profile', JSON.stringify(mockUser))
    render(
      <TestProvider>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <Profile />
        </SWRConfig>
      </TestProvider>
    )
    await waitFor(() => {
      screen.getByText(/Clips/)
    })
  })

  it('renders empty page if user is no session', async () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([null, false])
    jestMockFetch.doMockIf('http://localhost:3001/api/profile', JSON.stringify(mockUser))
    const { container } = render(
      <TestProvider>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <Profile />
        </SWRConfig>
      </TestProvider>
    )
    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('renders username modal only when profile is loaded and it has no username', async () => {
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: 'image', name: 'name' }, expires: '', accessToken: '' }, false])
    jestMockFetch.doMockIf('http://localhost:3001/api/profile', JSON.stringify({ ...mockUser, username: undefined }))
    render(
      <TestProvider>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <Profile />
        </SWRConfig>
      </TestProvider>
    )
    await waitFor(() => {
      screen.getByText(/Set an username for yourself/)
      expect(
        screen.queryByText(/Your username is used to create a link to your public profile/)
      ).not.toBeInTheDocument()
    })
  })

  it('shows a placeholder image if no profile image found', () => {
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    render(
      <TestProvider>
        <SWRConfig value={{ dedupingInterval: 0 }}>
          <Profile />
        </SWRConfig>
      </TestProvider>
    )
    expect(screen.getByAltText('Profile')).toHaveAttribute('src', '/android-chrome-256x256.png')
  })

  it('redirects to front page if not logged in', () => {
    const mockPush = jest.fn()
    mocked(useSession).mockReturnValue([null, false])
    mocked(useRouter).mockReturnValue({ push: mockPush } as unknown as NextRouter)
    render(
      <TestProvider>
        <Profile />
      </TestProvider>
    )
    expect(mockPush).toHaveBeenCalledWith('/')
  })

  it('renders the enable sync toggle if SITE_ENV is dev', async () => {
    jestMockFetch.doMockIf('http://localhost:3001/api/profile', JSON.stringify(mockUser))
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    mocked(isSiteEnvDev).mockReturnValue(true)
    render(
      <TestProvider>
        <Profile />
      </TestProvider>
    )
    await screen.findByLabelText('Enable cross browser syncing')
  })

  it('does not render the enable sync toggle if SITE_ENV is prod', async () => {
    jestMockFetch.doMockIf('http://localhost:3001/api/profile', JSON.stringify(mockUser))
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    mocked(isSiteEnvDev).mockReturnValue(false)
    render(
      <TestProvider>
        <Profile />
      </TestProvider>
    )
    await screen.findAllByText('username123') // wait for page to completely load async things
    expect(screen.queryByLabelText('Enable cross browser syncing')).not.toBeInTheDocument()
  })
})
