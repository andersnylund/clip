import { FC } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { SWRConfig } from 'swr'

import { useUser } from '../../src/hooks/useUser'
import { User } from '../../src/types'

const mockUser: User = {
  clips: [],
  folders: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

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
    jestFetchMock.doMock(JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TestComponent username="username" />
      </SWRConfig>
    )

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3000/api/clips/username')
    expect(screen.getByText('Error: undefined'))
    expect(
      screen.getByText('User: {"clips":[],"folders":[],"id":1,"image":"image","name":"name","username":"username"}')
    )
  })

  it('gets the user without username', async () => {
    jestFetchMock.mockResponse(JSON.stringify({ message: 'fail' }), { status: 400 })
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3000/api/clips/')
    expect(screen.getByText('Error: Error: An error occurred while fetching the data'))
  })

  it('throws http error of getting profile fails', async () => {
    jestFetchMock.mockResponse(JSON.stringify({ message: 'fail' }), { status: 400 })
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TestComponent username="username" />
      </SWRConfig>
    )

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('http://localhost:3000/api/clips/username')
    expect(screen.getByText('Error: Error: An error occurred while fetching the data'))
  })
})
