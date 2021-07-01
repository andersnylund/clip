import { fireEvent, render, screen } from '@testing-library/react'
import { signIn, useSession } from 'next-auth/client'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../src/hooks/useProfile'
import Index from '../../src/pages/index'
import { TestProvider } from '../TestProvider'

jest.mock('next-auth/client')
jest.mock('../../src/hooks/useProfile')

describe('index', () => {
  beforeEach(() => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([
      { user: { name: 'test', email: 'test@example.com', image: 'image' }, expires: '', accessToken: '' },
      false,
    ])
    const mockUseProfile = mocked(useProfile)
    mockUseProfile.mockReturnValue({
      isLoading: false,
      profile: { clips: [], id: 1, image: 'image', name: 'name', username: 'username' },
    })
  })

  it('renders when logged in', () => {
    render(
      <TestProvider>
        <Index />
      </TestProvider>
    )
    expect(screen.getByText('Logged in as')).toBeInTheDocument()
    expect(screen.getByText('username')).toBeInTheDocument()
  })

  it('renders when not logged in', () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([null, false])
    render(
      <TestProvider>
        <Index />
      </TestProvider>
    )
    expect(screen.queryByText('Logged in as')).not.toBeInTheDocument()
    expect(screen.queryByText('username')).not.toBeInTheDocument()
  })

  it('calls sign in on click', () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([null, false])
    render(
      <TestProvider>
        <Index />
      </TestProvider>
    )
    fireEvent.click(screen.getByText('Clip'))
    expect(signIn).toHaveBeenCalled()
  })
})
