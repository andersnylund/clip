import React from 'react'
import { render } from '@testing-library/react'
import { useSession } from 'next-auth/client'

import Index from '../../src/pages/index'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(),
}))

describe('index', () => {
  it('renders', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: { name: 'test' } }, false])
    render(<Index />)
  })
})
