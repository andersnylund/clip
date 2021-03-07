import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'
import jestFetchMock from 'jest-fetch-mock'
import { FolderHeader } from '../../src/components/FolderHeader'
import { PROFILE_PATH } from '../../src/hooks/useProfile'
import { Clip } from '../../src/types'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

const mockClip: Clip = {
  clips: [],
  id: '123',
  index: 0,
  parentId: null,
  title: 'title',
  url: 'asdf',
  userId: 0,
}

describe('<FolderHeader />', () => {
  beforeAll(jestFetchMock.enableMocks)
  beforeEach(jestFetchMock.mockClear)

  it('renders the folder title', () => {
    render(<FolderHeader folder={mockClip} />)
    expect(screen.getByText('title'))
  })

  it("opens, changes value, and closes the input but doesn't update the folder name", () => {
    render(<FolderHeader folder={mockClip} />)

    fireEvent.click(screen.getByTitle('Edit'))
    fireEvent.focus(screen.getByDisplayValue('title'))
    fireEvent.change(screen.getByDisplayValue('title'), { target: { value: 'new title' } })
    fireEvent.blur(screen.getByDisplayValue('new title'))

    expect(screen.getByText('title'))
    expect(fetch).not.toHaveBeenCalled()
  })

  it('updates the folder title', async () => {
    render(<FolderHeader folder={mockClip} />)

    fireEvent.click(screen.getByTitle('Edit'))
    fireEvent.focus(screen.getByDisplayValue('title'))
    fireEvent.change(screen.getByDisplayValue('title'), { target: { value: 'new title' } })

    act(() => {
      fireEvent.submit(screen.getByDisplayValue('new title'))
    })

    await waitFor(() => {
      expect(screen.getByText('title'))
      expect(fetch).toHaveBeenCalledWith('/api/clip/123', {
        body: JSON.stringify({ title: 'new title', parentId: null }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })

  it('deletes a folder', () => {
    render(<FolderHeader folder={mockClip} />)
    fireEvent.click(screen.getByTitle('Remove'))

    expect(fetch).toHaveBeenCalledWith('/api/clip/123', { method: 'DELETE' })
  })
})
