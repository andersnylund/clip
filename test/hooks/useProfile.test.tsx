import { FC } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { SWRConfig } from 'swr'

import { useProfile } from '../../src/hooks/useProfile'
import { User } from '../../src/types'

const mockUser: User = {
  clips: [],
  folders: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

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
  })

  it('gets the profile', async () => {
    jestFetchMock.doMock(JSON.stringify(mockUser))
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(jestFetchMock).toHaveBeenCalledWith('/api/profile')
    expect(screen.getByText('Error: undefined'))
    expect(
      screen.getByText('Profile: {"clips":[],"folders":[],"id":1,"image":"image","name":"name","username":"username"}')
    )
  })

  it('throws http error of getting profile fails', async () => {
    jestFetchMock.mockResponse(JSON.stringify({ message: 'fail' }), { status: 400 })
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <TestComponent />
      </SWRConfig>
    )

    await waitFor(() => {
      screen.getByText('IsLoading: false')
    })

    expect(screen.getByText('Error: Error: Bad Request'))
  })
})
