import { fireEvent, render, screen } from '@testing-library/react'
import { findIndexInTree, SortableTree } from '../../../src/components/Tree/SortableTree'
import { TreeItems } from '../../../src/components/Tree/types'
import jestFetchMock from 'jest-fetch-mock'

describe('<SortableTree />', () => {
  beforeEach(() => {
    jestFetchMock.enableMocks()
  })

  describe('findIndex', () => {
    it('finds the index of a parent level item', () => {
      const items: TreeItems = [{ id: '1', parentId: null, children: [], title: '1', url: '1' }]

      expect(findIndexInTree(items, '1')).toEqual(0)
    })

    it('returns -1 if item not found', () => {
      const items: TreeItems = [{ id: '1', parentId: null, children: [], title: '1', url: '1' }]

      expect(findIndexInTree(items, '3')).toEqual(-1)
    })

    it('finds the index of a child level item', () => {
      const items: TreeItems = [
        {
          id: '1',
          parentId: null,
          title: '1',
          url: '1',
          children: [
            {
              id: '2',
              parentId: '1',
              title: '2',
              url: '2',
              children: [],
            },
            {
              id: '3',
              parentId: '1',
              title: '3',
              url: '3',
              children: [],
            },
          ],
        },
      ]

      expect(findIndexInTree(items, '3')).toEqual(1)
    })

    it('finds the index of a child level item', () => {
      const items: TreeItems = [
        {
          id: '1',
          parentId: null,
          title: '1',
          url: '1',
          children: [
            {
              id: '2',
              parentId: '1',
              title: '2',
              url: '2',
              children: [],
            },
            {
              id: '3',
              parentId: '1',
              title: '3',
              url: '3',
              children: [
                {
                  id: '4',
                  parentId: '3',
                  title: '4',
                  url: '4',
                  children: [],
                },
                {
                  id: '5',
                  parentId: '3',
                  title: '5',
                  url: '5',
                  children: [],
                },
              ],
            },
          ],
        },
      ]

      expect(findIndexInTree(items, '4')).toEqual(0)
    })

    it('renders all clips by default if none is collapsed', () => {
      const items: TreeItems = [
        {
          id: '1',
          parentId: null,
          title: '1',
          url: '1',
          children: [
            {
              id: '2',
              parentId: '1',
              title: '2',
              url: '2',
              children: [],
            },
            {
              id: '3',
              parentId: '1',
              title: '3',
              url: '3',
              children: [],
            },
          ],
        },
      ]

      render(<SortableTree initialItems={items} />)
      screen.getByText('1')
      screen.getByText('2')
      screen.getByText('3')
    })

    it('does not show the collapsed items', () => {
      const items: TreeItems = [
        {
          id: '1',
          parentId: null,
          title: '1',
          url: '1',
          collapsed: true,
          children: [
            {
              id: '2',
              parentId: '1',
              title: '2',
              url: '2',
              children: [],
            },
            {
              id: '3',
              parentId: '1',
              title: '3',
              url: '3',
              children: [],
            },
          ],
        },
      ]

      render(<SortableTree initialItems={items} />)
      screen.getByText('1')
      expect(screen.queryByText('2')).not.toBeInTheDocument()
      expect(screen.queryByText('3')).not.toBeInTheDocument()
    })

    it('toggles open folder', () => {
      const items: TreeItems = [
        {
          id: '1',
          parentId: null,
          title: '1',
          url: '1',
          collapsed: true,
          children: [
            {
              id: '2',
              parentId: '1',
              title: '2',
              url: '2',
              children: [],
            },
            {
              id: '3',
              parentId: '1',
              title: '3',
              url: '3',
              children: [],
            },
          ],
        },
      ]

      render(<SortableTree initialItems={items} />)
      fireEvent.click(screen.getByTitle('Toggle collapse'))
      expect(jestFetchMock).toHaveBeenCalledWith('/api/clip/1', {
        body: JSON.stringify({ collapsed: false }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })
    })

    it('toggles close folder', () => {
      const items: TreeItems = [
        {
          id: '1',
          parentId: null,
          title: '1',
          url: '1',
          collapsed: false,
          children: [
            {
              id: '2',
              parentId: '1',
              title: '2',
              url: '2',
              children: [],
            },
            {
              id: '3',
              parentId: '1',
              title: '3',
              url: '3',
              children: [],
            },
          ],
        },
      ]

      render(<SortableTree initialItems={items} />)
      fireEvent.click(screen.getByTitle('Toggle collapse'))
      expect(jestFetchMock).toHaveBeenCalledWith('/api/clip/1', {
        body: JSON.stringify({ collapsed: true }),
        headers: { 'Content-Type': 'application/json' },
        method: 'PUT',
      })
    })
  })
})
