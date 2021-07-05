import { Clip } from '.prisma/client'
import { mocked } from 'ts-jest/utils'
import { getChildren } from '../src/children'
import prisma from '../src/prisma'

jest.mock('../src/prisma', () => ({
  clip: {
    findMany: jest.fn(),
  },
}))

const mockClip: Clip = {
  collapsed: false,
  id: 'id',
  index: 0,
  parentId: null,
  title: 'title',
  url: 'url',
  userId: 0,
  browserIds: [],
}

describe('children', () => {
  describe('getChildren', () => {
    beforeEach(() => {
      mocked(prisma.clip.findMany).mockClear()
    })
    it('calls the database only once', async () => {
      mocked(prisma.clip.findMany).mockResolvedValue([])
      const result = await getChildren({
        collapsed: false,
        id: '1',
        index: 0,
        parentId: null,
        title: 'title',
        url: 'url',
        userId: 1,
        browserIds: [],
      })
      expect(result).toEqual([])
      expect(prisma.clip.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.clip.findMany).toHaveBeenCalledWith({
        include: {
          clips: {
            include: {
              clips: {
                include: {
                  clips: {
                    include: {
                      clips: true,
                    },
                  },
                },
              },
            },
          },
        },
        orderBy: {
          index: 'asc',
        },
        where: {
          parentId: '1',
        },
      })
    })

    it('calls the database twice', async () => {
      mocked(prisma.clip.findMany).mockResolvedValueOnce([mockClip])
      mocked(prisma.clip.findMany).mockResolvedValueOnce([])
      const result = await getChildren({
        collapsed: false,
        id: '1',
        index: 0,
        parentId: null,
        title: 'title',
        url: 'url',
        userId: 1,
        browserIds: [],
      })
      expect(result).toEqual([
        {
          clips: [],
          collapsed: false,
          id: 'id',
          index: 0,
          parentId: null,
          title: 'title',
          url: 'url',
          userId: 0,
          browserIds: [],
        },
      ])
      expect(prisma.clip.findMany).toHaveBeenCalledTimes(2)
    })

    it('', async () => {
      mocked(prisma.clip.findMany).mockResolvedValueOnce([{ ...mockClip, clips: [mockClip] } as Clip])
      mocked(prisma.clip.findMany).mockResolvedValueOnce([])
      const result = await getChildren({
        collapsed: false,
        id: '1',
        index: 0,
        parentId: null,
        title: 'title',
        url: 'url',
        userId: 1,
        browserIds: [],
      })
      expect(result).toEqual([
        {
          browserIds: [],
          clips: [
            {
              browserIds: [],
              clips: [],
              collapsed: false,
              id: 'id',
              index: 0,
              parentId: null,
              title: 'title',
              url: 'url',
              userId: 0,
            },
          ],
          collapsed: false,
          id: 'id',
          index: 0,
          parentId: null,
          title: 'title',
          url: 'url',
          userId: 0,
        },
      ])
      expect(prisma.clip.findMany).toHaveBeenCalledTimes(2)
    })
  })
})
