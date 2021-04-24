import { findIndexInTree } from '../../../src/components/Tree/SortableTree'
import { TreeItems } from '../../../src/components/Tree/types'

describe('<SortableTree />', () => {
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
  })
})
