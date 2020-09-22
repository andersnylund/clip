import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'

import { ProfileFolder } from '../../src/components/ProfileFolder'
import { PROFILE_PATH, useProfile } from '../../src/hooks/useProfile'

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(),
  PROFILE_PATH: jest.requireActual('../../src/hooks/useProfile').PROFILE_PATH,
}))

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

describe('<ProfileFolder />', () => {
  it('renders folder name', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })

    render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('renders null if no profile', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({})

    const { container } = render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)
    expect(screen.queryByText('name')).not.toBeInTheDocument()
    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('changes input value and submits a new clip', async () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })

    render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Clip url'), { target: { value: 'url' } })
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Clip url')).toHaveValue('url')
    })

    act(() => {
      fireEvent.click(screen.getByLabelText('clip'))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: '{"folderId":"id","name":"url","url":"url"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('Clip url')).toHaveValue('')
    })
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })
})
