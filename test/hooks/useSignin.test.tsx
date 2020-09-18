import { FC } from 'react'
import { render } from '@testing-library/react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { useSignin } from '../../src/hooks/useSignin'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(),
}))

jest.mock('next/router')

const TestComponent: FC = () => {
  useSignin()
  return <div />
}

describe('useSignin', () => {
  it('renders', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([{ user: {} }, false])

    render(<TestComponent />)
  })

  it('pushes to router if no session', () => {
    const mockUseSession = useSession as jest.Mock
    mockUseSession.mockReturnValue([undefined, false])

    const push = jest.fn()

    const mockUseRouter = useRouter as jest.Mock
    mockUseRouter.mockReturnValue({ push })

    render(<TestComponent />)

    expect(push).toHaveBeenCalledWith('/api/auth/signin')
  })
})
