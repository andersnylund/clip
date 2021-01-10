import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import Index from '../../src/pages/index'
import { useProfile } from '../../src/hooks/useProfile'

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
      profile: { folders: [], id: 1, image: 'image', name: 'name', username: 'username' },
    })
  })

  it('renders when logged in', () => {
    render(<Index />)
    expect(screen.getByText('Logged in as')).toBeInTheDocument()
    expect(screen.getByText('username')).toBeInTheDocument()
  })

  it('renders when not logged in', () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([undefined, false])
    render(<Index />)
    expect(screen.queryByText('Logged in as')).not.toBeInTheDocument()
    expect(screen.queryByText('username')).not.toBeInTheDocument()
  })

  it('calls sign in on click', () => {
    const mockUseSession = mocked(useSession)
    mockUseSession.mockReturnValue([undefined, false])
    render(<Index />)
    fireEvent.click(screen.getByText('Clip'))
    expect(signIn).toHaveBeenCalled()
  })
})
