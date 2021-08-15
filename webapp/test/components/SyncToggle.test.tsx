import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestMockFetch from 'jest-fetch-mock'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/client'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../../shared/hooks/useProfile'
import { User } from '../../../shared/types'
import { SyncToggle } from '../../src/components/SyncToggle'
import { TestProvider } from '../TestProvider'

const mockUUID = '5f6bf380-820d-43b0-a436-4afb6bcd5074'

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { image: 'image', name: 'name' } } as Session, false]),
}))

jest.mock('../../../shared/hooks/useProfile')

jest.mock('../../src/hooks/usePublicConfig')

jest.mock('uuid', () => ({
  v4: jest.fn(() => mockUUID),
}))

const mockUser: User = {
  clips: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username123',
  syncEnabled: false,
  syncId: null,
}

describe('<SyncToggle />', () => {
  beforeAll(jestMockFetch.enableMocks)
  beforeEach(() => {
    jestMockFetch.resetMocks()
  })

  it('toggles the switch off', async () => {
    const postMessageMock = jest.spyOn(window, 'postMessage')
    mocked(useProfile).mockReturnValue({
      isLoading: false,
      profile: { ...mockUser, syncEnabled: true, syncId: mockUUID },
    })

    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    render(
      <TestProvider>
        <SyncToggle />
      </TestProvider>
    )
    expect(await screen.findByRole('switch', { name: 'Enable cross browser syncing' })).toBeChecked()
    fireEvent.click(screen.getByRole('switch', { name: 'Enable cross browser syncing' }))
    await waitFor(() => {
      const expectedBody = {
        syncEnabled: false,
        syncId: null,
      }
      const bodyPayload = JSON.parse(jestMockFetch.mock.calls[0][1]?.body?.toString() ?? '')
      expect(jestMockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:3001/api/profile/toggle-sync', {
        body: expect.anything(),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })
      expect(bodyPayload).toEqual(expectedBody)
    })
    expect(postMessageMock).toHaveBeenCalledWith(
      {
        payload: {
          syncEnabled: false,
          syncId: null,
        },
        type: 'TOGGLE_SYNC',
      },
      'http://localhost/'
    )
  })

  it('toggles the switch on', async () => {
    const postMessageMock = jest.spyOn(window, 'postMessage')
    mocked(useProfile).mockReturnValue({ isLoading: false, profile: mockUser })
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    render(
      <TestProvider>
        <SyncToggle />
      </TestProvider>
    )
    await waitFor(() => {
      expect(screen.getByRole('switch')).not.toBeChecked()
    })
    fireEvent.click(screen.getByRole('switch', { name: 'Enable cross browser syncing' }))
    await waitFor(() => {
      const expectedBody = {
        syncEnabled: true,
        syncId: '5f6bf380-820d-43b0-a436-4afb6bcd5074',
      }
      const bodyPayload = JSON.parse(jestMockFetch.mock.calls[0][1]?.body?.toString() ?? '')
      expect(jestMockFetch).toHaveBeenNthCalledWith(1, 'http://localhost:3001/api/profile/toggle-sync', {
        body: expect.anything(),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
      })
      expect(bodyPayload).toEqual(expectedBody)
    })
    expect(postMessageMock).toHaveBeenCalledWith(
      {
        payload: {
          syncEnabled: true,
          syncId: '5f6bf380-820d-43b0-a436-4afb6bcd5074',
        },
        type: 'TOGGLE_SYNC',
      },
      'http://localhost/'
    )
  })

  it('defaults to toggled of if profile is undefined', async () => {
    mocked(useProfile).mockReturnValue({ isLoading: false, profile: undefined })
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    render(
      <TestProvider>
        <SyncToggle />
      </TestProvider>
    )
    await waitFor(() => {
      expect(screen.getByRole('switch')).not.toBeChecked()
    })
  })
})
