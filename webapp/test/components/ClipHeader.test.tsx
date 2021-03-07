import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'
import jestFetchMock from 'jest-fetch-mock'
import { ClipHeader, ClipWithUrl } from '../../src/components/ClipHeader'
import { PROFILE_PATH } from '../../src/hooks/useProfile'
import { Children } from 'react'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

jest.mock('next/link', () => ({ children }: { children: typeof Children }) => children)

const mockClip: ClipWithUrl = {
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
  beforeEach(jestFetchMock.mockClear)

  it('renders the clip title', () => {
    render(<ClipHeader clip={mockClip} />)
    expect(screen.getByText('title'))
  })

  it('updates the clip title', async () => {
    render(<ClipHeader clip={mockClip} />)

    fireEvent.click(screen.getByTitle('Edit'))
    fireEvent.focus(screen.getByDisplayValue('title'))
    fireEvent.change(screen.getByDisplayValue('title'), { target: { value: 'new title' } })
    fireEvent.focus(screen.getByDisplayValue('asdf'))
    fireEvent.change(screen.getByDisplayValue('asdf'), { target: { value: 'new url' } })

    act(() => {
      fireEvent.submit(screen.getByDisplayValue('new title'))
    })

    await waitFor(() => {
      expect(screen.getByText('title'))
      expect(fetch).toHaveBeenCalledWith('/api/clip/123', {
        body: JSON.stringify({ url: 'new url', title: 'new title', parentId: null }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })

  it('deletes a clip', () => {
    render(<ClipHeader clip={mockClip} />)
    fireEvent.click(screen.getByTitle('Remove'))

    expect(fetch).toHaveBeenCalledWith('/api/clip/123', { method: 'DELETE' })
  })
})
