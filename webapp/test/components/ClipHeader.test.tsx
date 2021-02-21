import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'
import jestFetchMock from 'jest-fetch-mock'
import { ClipHeader } from '../../src/components/ClipHeader'
import { PROFILE_PATH } from '../../src/hooks/useProfile'
import { Clip } from '../../../types'

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

describe('<ClipHeader />', () => {
  beforeAll(jestFetchMock.enableMocks)

  it('renders the clip title', () => {
    render(<ClipHeader clip={mockClip} />)
    expect(screen.getByText('title'))
  })

  it("opens, changes value, and closes the input but doesn't update the clip name", () => {
    render(<ClipHeader clip={mockClip} />)

    fireEvent.click(screen.getByText('title'))
    fireEvent.focus(screen.getByDisplayValue('title'))
    fireEvent.change(screen.getByDisplayValue('title'), { target: { value: 'new title' } })
    fireEvent.blur(screen.getByDisplayValue('new title'))

    expect(screen.getByText('title'))
    expect(fetch).not.toHaveBeenCalled()
  })

  it('updates the clip title', async () => {
    render(<ClipHeader clip={mockClip} />)

    fireEvent.click(screen.getByText('title'))
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
})
