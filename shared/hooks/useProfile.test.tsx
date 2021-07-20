import { render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { FC } from 'react'
import useSWR from 'swr'
import { User } from '../types'
import { HttpError } from './http-error'
import { fetchProfile, useProfile } from './useProfile'

const mockUser: User = {
  clips: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
  syncEnabled: false,
  syncId: null,
}

jest.mock('swr', () => ({
  __esModule: true,
  default: jest.fn(),
}))

const TestComponent: FC = () => {
  const { error, isLoading, profile } = useProfile()

  return (
    <>
      <div>{`Error: ${error}`}</div>
      <div>{`IsLoading: ${isLoading}`}</div>
      <div>{`Profile: ${JSON.stringify(profile)}`}</div>
    </>
  )
}

describe('useProfile', () => {
  beforeEach(() => {
    jestFetchMock.enableMocks()
    jestFetchMock.resetMocks()
    jest.clearAllMocks()
  })

  it('gets the profile', async () => {
    const mockUseSWR = useSWR as jest.Mock

    mockUseSWR.mockImplementation((cacheKey: string, fetcher: () => Promise<unknown>) => {
      fetcher()
      return { data: mockUser, error: undefined }
    })

    jestFetchMock.doMock(JSON.stringify(mockUser))
    render(<TestComponent />)

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3001/api/profile')
    expect(screen.getByText('Error: undefined'))
    expect(
      screen.getByText(
        'Profile: {"clips":[],"id":1,"image":"image","name":"name","username":"username","syncEnabled":false,"syncId":null}'
      )
    )
    expect(mockUseSWR).toHaveBeenCalledWith('/api/profile', fetchProfile)
  })

  it('throws http error if getting profile fails', async () => {
    const mockUseSWR = useSWR as jest.Mock

    mockUseSWR.mockImplementation((cacheKey: string, fetcher: () => Promise<unknown>) => {
      fetcher().catch(() => {
        // silent fail
      })

      return { data: mockUser, error: new HttpError('Bad Request', 'Bad Request', 400) }
    })

    jestFetchMock.mockResponse(JSON.stringify({ message: 'fail' }), { status: 400 })
    render(<TestComponent />)

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(screen.getByText('Error: Error: Bad Request'))
    expect(useSWR).toHaveBeenCalledWith('/api/profile', fetchProfile)
  })
})
