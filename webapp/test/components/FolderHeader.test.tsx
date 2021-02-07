import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'

import { ClipHeader } from '../../src/components/ClipHeader'
import { PROFILE_PATH } from '../../src/hooks/useProfile'
import { Folder } from '../../src/types'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

const mockFolder: Folder = {
  clips: [],
  id: 'id',
  name: 'name',
}

describe('<FolderHeader />', () => {
  it('renders the folder name', () => {
    render(<ClipHeader folder={mockFolder} />)
    expect(screen.getByText('name'))
  })

  it("opens, changes value, and closes the input but doesn't update the folder name", () => {
    render(<ClipHeader folder={mockFolder} />)

    fireEvent.click(screen.getByText('name'))
    fireEvent.focus(screen.getByDisplayValue('name'))
    fireEvent.change(screen.getByDisplayValue('name'), { target: { value: 'new name' } })
    fireEvent.blur(screen.getByDisplayValue('new name'))

    expect(screen.getByText('name'))
    expect(fetch).not.toHaveBeenCalled()
  })

  it('updates the folder value', async () => {
    render(<ClipHeader folder={mockFolder} />)

    fireEvent.click(screen.getByText('name'))
    fireEvent.focus(screen.getByDisplayValue('name'))
    fireEvent.change(screen.getByDisplayValue('name'), { target: { value: 'new name' } })

    act(() => {
      fireEvent.submit(screen.getByDisplayValue('new name'))
    })

    await waitFor(() => {
      expect(screen.getByText('name'))
      expect(fetch).toHaveBeenCalledWith('/api/folder/id', {
        body: '{"folderName":"new name"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })
})
