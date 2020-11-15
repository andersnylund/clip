import { fireEvent, render, screen } from '@testing-library/react'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  mockGetComputedSpacing,
  mockDndElSpacing,
  makeDnd,
  DND_DRAGGABLE_DATA_ATTR,
  DND_DIRECTION_DOWN,
  DND_DIRECTION_UP,
} from 'react-beautiful-dnd-test-utils'

import { ProfileClipList } from '../../src/components/ProfileClipList'
import { Clip, Folder } from '../../src/types'

const mockClips: Clip[] = [
  { id: 'clipId1', folderId: 'folderId1', name: 'clip1', url: 'url1', userId: 1, orderIndex: 1 },
  { id: 'clipId2', folderId: 'folderId2', name: 'clip2', url: 'url2', userId: 2, orderIndex: 2 },
]

const mockFolder: Folder = {
  clips: mockClips,
  id: 'folderId',
  name: 'mock folder name',
}

describe('<ProfileClipList />', () => {
  it('renders two clips', () => {
    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <ProfileClipList folder={mockFolder} />
      </DragDropContext>
    )
    expect(screen.getByText('clip1').closest('a')).toHaveAttribute('href', 'url1')
    expect(screen.getByText('clip2').closest('a')).toHaveAttribute('href', 'url2')
  })

  it('deletes a clip', () => {
    render(
      <DragDropContext onDragEnd={jest.fn()}>
        <ProfileClipList folder={mockFolder} />
      </DragDropContext>
    )
    const button = screen.getByText('clip1').nextSibling

    if (!button) {
      fail('no delete button found')
    }

    fireEvent.click(button)

    expect(fetch).toHaveBeenCalledWith('/api/clip/clipId1', { method: 'DELETE' })
  })

  it('allows to move the first clip down', async () => {
    const mockOnDragEnd = jest.fn()
    render(
      <DragDropContext onDragEnd={mockOnDragEnd}>
        <ProfileClipList folder={mockFolder} />
      </DragDropContext>
    )
    const makeGetDragEl = (text: string) => () => screen.getByText(text).closest(DND_DRAGGABLE_DATA_ATTR)

    await makeDnd({
      getByText: screen.getByText,
      getDragEl: makeGetDragEl('clip1'),
      direction: DND_DIRECTION_DOWN,
      positions: 2,
    })

    expect(mockOnDragEnd).toHaveBeenCalledWith(
      {
        combine: null,
        destination: {
          droppableId: 'folderId',
          index: 1,
        },
        draggableId: 'clipId1',
        mode: 'SNAP',
        reason: 'DROP',
        source: {
          droppableId: 'folderId',
          index: 0,
        },
        type: 'CLIP',
      },
      expect.anything()
    )
    expect(screen.getByText(/You have moved the item from position 1 to position 2/))
  })

  it('allows to move the second clip up', async () => {
    const mockOnDragEnd = jest.fn()
    render(
      <DragDropContext onDragEnd={mockOnDragEnd}>
        <ProfileClipList folder={mockFolder} />
      </DragDropContext>
    )
    const makeGetDragEl = (text: string) => () => screen.getByText(text).closest(DND_DRAGGABLE_DATA_ATTR)

    await makeDnd({
      getByText: screen.getByText,
      getDragEl: makeGetDragEl('clip2'),
      direction: DND_DIRECTION_UP,
      positions: 1,
    })

    expect(mockOnDragEnd).toHaveBeenCalledWith(
      {
        combine: null,
        destination: {
          droppableId: 'folderId',
          index: 0,
        },
        draggableId: 'clipId2',
        mode: 'SNAP',
        reason: 'DROP',
        source: {
          droppableId: 'folderId',
          index: 1,
        },
        type: 'CLIP',
      },
      expect.anything()
    )
    expect(screen.getByText(/You have moved the item from position 2 to position 1/))
  })
})
