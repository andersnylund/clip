import { FC } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import useSWR from 'swr'

import { useUser } from '../../src/hooks/useUser'
import { User } from '../../src/types'
import { HttpError } from '../../src/error/http-error'

const mockUser: User = {
  clips: [],
  folders: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const TestComponent: FC<{ username?: string }> = ({ username }) => {
  const { error, isLoading, user } = useUser(username)

  return (
    <>
      <div>{`Error: ${error}`}</div>
      <div>{`IsLoading: ${isLoading}`}</div>
      <div>{`User: ${JSON.stringify(user)}`}</div>
    </>
  )
}

describe('useUser', () => {
  beforeEach(() => {
    jestFetchMock.resetMocks()
  })

  it('gets the user', async () => {
    const mockUseSWR = useSWR as jest.Mock

    mockUseSWR.mockImplementation((cacheKey: string, fetcher: () => Promise<unknown>) => {
      fetcher()
      return { data: mockUser, error: undefined }
    })

    jestFetchMock.doMock(JSON.stringify(mockUser))
    render(<TestComponent username="username" />)

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3000/api/clips/username')
    expect(useSWR).toHaveBeenCalledWith('/api/clips/username', expect.anything(), { initialData: undefined })
    expect(screen.getByText('Error: undefined'))
    expect(
      screen.getByText('User: {"clips":[],"folders":[],"id":1,"image":"image","name":"name","username":"username"}')
    )
  })

  it('fails without username', async () => {
    const mockUseSWR = useSWR as jest.Mock

    mockUseSWR.mockImplementation((cacheKey: string, fetcher: () => Promise<unknown>) => {
      fetcher().catch(() => {
        // silent fail
      })
      return { data: undefined, error: new HttpError('Bad Request', 'Bad Request', 400) }
    })

    jestFetchMock.mockResponse(JSON.stringify({ message: 'fail' }), { status: 400 })
    render(<TestComponent />)

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3000/api/clips/')
    expect(screen.getByText('Error: Error: Bad Request'))
  })

  it('throws http error of getting profile fails', async () => {
    const mockUseSWR = useSWR as jest.Mock

    mockUseSWR.mockImplementation((cacheKey: string, fetcher: () => Promise<unknown>) => {
      fetcher().catch(() => {
        // silent fail
      })
      return { data: undefined, error: new HttpError('Bad Request', 'Bad Request', 400) }
    })

    jestFetchMock.mockResponse(JSON.stringify({ message: 'fail' }), { status: 400 })
    render(<TestComponent username="username" />)

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3000/api/clips/username')
    expect(screen.getByText('Error: Error: Bad Request'))
  })
})