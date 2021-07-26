import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestMockFetch from 'jest-fetch-mock'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/client'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../../shared/hooks/useProfile'
import { User } from '../../../shared/types'
import { SyncToggle } from '../../src/components/SyncToggle'
import { isSiteEnvDev } from '../../src/hooks/usePublicConfig'
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

  it('renders the enable sync toggle if SITE_ENV is dev', async () => {
    mocked(useProfile).mockReturnValue({ isLoading: false, profile: mockUser })
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    mocked(isSiteEnvDev).mockReturnValue(true)
    render(
      <TestProvider>
        <SyncToggle />
      </TestProvider>
    )
    await screen.findByLabelText('Enable cross browser syncing')
  })

  it('does not render the enable sync toggle if SITE_ENV is prod', async () => {
    mocked(useProfile).mockReturnValue({ isLoading: false, profile: mockUser })
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    mocked(isSiteEnvDev).mockReturnValue(false)
    const { container } = render(
      <TestProvider>
        <SyncToggle />
      </TestProvider>
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('toggles the switch off', async () => {
    mocked(useProfile).mockReturnValue({
      isLoading: false,
      profile: { ...mockUser, syncEnabled: true, syncId: mockUUID },
    })

    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    mocked(isSiteEnvDev).mockReturnValue(true)
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
  })

  it('toggles the switch on', async () => {
    mocked(useProfile).mockReturnValue({ isLoading: false, profile: mockUser })
    const mockUseSession = mocked(useSession, true)
    mockUseSession.mockReturnValue([{ user: { image: undefined, name: 'name' }, expires: '', accessToken: '' }, false])
    mocked(isSiteEnvDev).mockReturnValue(true)
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
  })
})
