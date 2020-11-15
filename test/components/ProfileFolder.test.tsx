import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { DragDropContext } from 'react-beautiful-dnd'
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

    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />
      </DragDropContext>
    )
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('renders null if no profile', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({})

    const { container } = render(
      <DragDropContext onDragEnd={jest.fn()}>
        <ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />
      </DragDropContext>
    )
    expect(screen.queryByText('name')).not.toBeInTheDocument()
    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('opens the add clip', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })
    expect(screen.queryByPlaceholderText('URL')).not.toBeInTheDocument()

    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />
      </DragDropContext>
    )

    fireEvent.click(screen.getByText(/New/))

    expect(screen.getByPlaceholderText('URL'))
  })

  it('deletes a folder', async () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })

    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />
      </DragDropContext>
    )

    fireEvent.click(screen.getByText('✕'))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/folder/id', { method: 'DELETE' })
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })
})
