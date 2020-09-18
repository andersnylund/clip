import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { useSession, signIn } from 'next-auth/client'

import Index from '../../src/pages/index'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(),
  signIn: jest.fn(),
}))

describe('index', () => {
  it('renders when logged in', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: { name: 'test' } }, false])
    render(<Index />)
    expect(screen.getByText('Logged in as')).toBeInTheDocument()
    expect(screen.getByText('test')).toBeInTheDocument()
  })

  it('renders when not logged in', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([undefined, false])
    render(<Index />)
    expect(screen.queryByText('Logged in as')).not.toBeInTheDocument()
    expect(screen.queryByText('test')).not.toBeInTheDocument()
  })

  it('calls sign in on click', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([undefined, false])
    render(<Index />)
    fireEvent.click(screen.getByText('Clip'))
    expect(signIn).toHaveBeenCalled()
  })
})
