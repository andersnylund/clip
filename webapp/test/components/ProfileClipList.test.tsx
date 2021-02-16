import { fireEvent, render, screen } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { mocked } from 'ts-jest/utils'
import { handleDragEnd, ProfileClipList } from '../../src/components/ProfileClipList'
import { Clip } from '../../src/types'

const mockClips: Clip[] = [
  {
    id: 'folderId1',
    parentId: null,
    title: 'folderTitle1',
    url: null,
    index: 1,
    clips: [{ id: 'clipId1', parentId: null, title: 'clip1', url: 'url1', index: 1, clips: [], userId: 0 }],
    userId: 0,
  },

  { id: 'clipId2', parentId: null, title: 'clip2', url: 'url2', index: 2, clips: [], userId: 0 },
]

describe('<ProfileClipList />', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(() => {
    const mockFetch = mocked(fetch)
    mockFetch.mockClear()
  })

  it('renders two clips', () => {
    render(<ProfileClipList clips={mockClips} />)
    expect(screen.getByText('clip1'))
    expect(screen.getByText('clip2'))
  })

  it('deletes a clip', () => {
    render(<ProfileClipList clips={mockClips} />)
    const button = screen.getByText('clip1').nextSibling

    if (!button) {
      fail('no delete button found')
    }

    fireEvent.click(button)

    expect(fetch).toHaveBeenCalledWith('/api/clip/clipId1', { method: 'DELETE' })
  })

  it('deletes a folder', () => {
    render(<ProfileClipList clips={mockClips} />)
    const button = screen.getByText('folderTitle1').nextSibling

    if (!button) {
      fail('no delete button found')
    }

    fireEvent.click(button)

    expect(fetch).toHaveBeenCalledWith('/api/clip/folderId1', { method: 'DELETE' })
  })

  it('calls fetch when dragging clip', async () => {
    await handleDragEnd({ active: { id: 'activeId' }, over: { id: 'overId' }, delta: { x: 1, y: 1 } })
    expect(fetch).toHaveBeenCalledWith('/api/clip/activeId', {
      body: JSON.stringify({ parentId: 'overId' }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    })
  })

  it('does not call fetch when dragging clip over the same folder as before', async () => {
    await handleDragEnd({ active: { id: 'activeId' }, over: { id: 'activeId' }, delta: { x: 1, y: 1 } })
    expect(fetch).not.toHaveBeenCalled()
  })
})
