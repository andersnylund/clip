import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import Index from '../../src/pages/index'

jest.mock('next-auth/client')

describe('index', () => {
  it('renders when logged in', () => {
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([
      { user: { name: 'test', email: 'test@example.com', image: 'image' }, expires: '', accessToken: '' },
      false,
    ])
    render(<Index />)
    expect(screen.getByText('Logged in as')).toBeInTheDocument()
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('renders when not logged in', () => {
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([undefined, false])
    render(<Index />)
    expect(screen.queryByText('Logged in as')).not.toBeInTheDocument()
    expect(screen.queryByText('test')).not.toBeInTheDocument()
  })

  it('calls sign in on click', () => {
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([undefined, false])
    render(<Index />)
    fireEvent.click(screen.getByText('Clip'))
    expect(signIn).toHaveBeenCalled()
  })
})
