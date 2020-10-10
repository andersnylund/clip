import { fireEvent, render, screen, waitFor } from '@testing-library/react'
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

  it('opens the add clip', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })
    expect(screen.queryByPlaceholderText('Clip url')).not.toBeInTheDocument()

    render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)

    fireEvent.click(screen.getByText(/Add/))

    expect(screen.getByPlaceholderText('Clip url'))
  })

  it('deletes a folder', async () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })

    render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)

    fireEvent.click(screen.getByText('✕'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/folder/id', { method: 'DELETE' })
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })
})
