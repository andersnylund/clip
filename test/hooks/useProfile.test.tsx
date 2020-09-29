import { FC } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import useSWR from 'swr'

import { fetchProfile, useProfile } from '../../src/hooks/useProfile'
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
    jestFetchMock.resetMocks()
    jest.clearAllMocks()
  })

  it.only('gets the profile', async () => {
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

    expect(jestFetchMock).toHaveBeenCalledWith('/api/profile')
    expect(screen.getByText('Error: undefined'))
    expect(
      screen.getByText('Profile: {"clips":[],"folders":[],"id":1,"image":"image","name":"name","username":"username"}')
    )
    expect(mockUseSWR).toHaveBeenCalledWith('/api/profile', fetchProfile)
  })

  it.only('throws http error of getting profile fails', async () => {
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
