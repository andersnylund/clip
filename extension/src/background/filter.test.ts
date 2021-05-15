import { Bookmarks } from 'webextension-polyfill-ts'
import { filterBookmark } from './filter'

const mockBookmark: Bookmarks.BookmarkTreeNode = {
  id: '1',
  title: '1',
  type: 'folder',
  children: [
    {
      id: '2',
      title: '2',
      type: 'separator',
      children: [
        {
          id: '3',
          title: '3',
          type: 'bookmark',
        },
      ],
    },
    { id: '4', title: '4', type: 'folder', children: [{ id: '6', title: '6', type: 'separator' }] },
    { id: '5', title: '5', type: 'bookmark', children: undefined },
  ],
}

describe('filter', () => {
  it('filters out separators recursively', () => {
    const result = filterBookmark(mockBookmark)
    expect(result).toEqual({
      id: '1',
      title: '1',
      type: 'folder',
      children: [
        { id: '4', title: '4', type: 'folder', children: [] },
        { id: '5', title: '5', type: 'bookmark' },
      ],
    })
  })

  it('returns undefined for undefined', () => {
    expect(filterBookmark(undefined)).toBeUndefined()
  })
})
