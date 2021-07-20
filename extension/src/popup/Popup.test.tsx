import { render, screen } from '@testing-library/react'
import React from 'react'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../../shared/hooks/useProfile'
import Popup from './Popup'

jest.mock('../../../shared/hooks/useProfile')

describe('<Popup.tsx />', () => {
  it('renders logged in users name', async () => {
    mocked(useProfile).mockReturnValue({
      profile: {
        clips: [],
        id: 0,
        image: 'image',
        name: 'name',
        username: 'username',
        syncEnabled: false,
        syncId: 'uuid', // TODO: replace with a real uuid
      },
      isLoading: false,
    })
    render(<Popup />)
    await screen.findByText(/Logged in as/)
    await screen.findByText(/name/)
  })

  it('shows the user a log in link if not logged in', async () => {
    mocked(useProfile).mockReturnValue({
      isLoading: false,
      profile: undefined,
    })
    render(<Popup />)
    await screen.findByText(/Not logged in. Log in at/)
    expect(await screen.findByText(new RegExp('http://localhost:3001'))).toHaveProperty(
      'href',
      'http://localhost:3001/'
    )
  })

  it("doesn't show anything else than clip.so if loading", async () => {
    mocked(useProfile).mockReturnValue({
      isLoading: true,
    })
    render(<Popup />)
    await screen.findByText(/clip.so/)
    expect(screen.queryByText(/Not logged in. Log in at/)).not.toBeInTheDocument()
  })
})
