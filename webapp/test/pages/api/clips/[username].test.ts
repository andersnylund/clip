import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { mocked } from 'ts-jest/utils'
import handler, { PrismaUserWithClips } from '../../../../src/pages/api/clips/[username]'

jest.mock('@prisma/client')

const mockUser: PrismaUserWithClips = {
  createdAt: new Date(),
  email: 'email',
  emailVerified: new Date(),
  id: 1,
  image: 'image',
  name: 'name',
  updatedAt: new Date(),
  username: 'username',
  clips: [
    {
      id: 'clipId1',
      title: 'clipTitle1',
      userId: 1,
      parentId: null,
      index: 0,
      url: null,
      clips: [
        {
          id: 'clipId2',
          title: 'clipTitle2',
          url: 'clipUrl',
          index: 0,
          userId: 1,
          parentId: null,
        },
      ],
    },
  ],
}

describe('username api', () => {
  it('gets the user clips', async () => {
    const findUnique = jest.fn().mockReturnValue(mockUser)
    const findMany = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.clip = { findMany }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: 'username' } } as unknown) as NextApiRequest,
      ({ status, json } as unknown) as NextApiResponse
    )
    expect(findUnique).toHaveBeenCalledWith({
      where: {
        username: 'username',
      },
      include: {
        clips: {
          where: {
            parentId: null,
          },
          orderBy: {
            url: 'asc',
          },
        },
      },
    })
    expect(json).toHaveBeenCalledWith({
      clips: [
        {
          id: 'clipId1',
          title: 'clipTitle1',
          parentId: null,
          index: 0,
          url: null,
          userId: 1,
          clips: [
            {
              id: 'clipId2',
              title: 'clipTitle2',
              url: 'clipUrl',
              index: 0,
              parentId: null,
              clips: [],
              userId: 1,
            },
          ],
        },
      ],
      id: 1,
      image: 'image',
      name: 'name',
      username: 'username',
    })
  })

  it('returns 404 if user not found', async () => {
    const findUnique = jest.fn().mockReturnValue(null)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: 'username' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(findUnique).toHaveBeenCalledWith({
      include: { clips: { orderBy: { url: 'asc' }, where: { parentId: null } } },
      where: { username: 'username' },
    })
    expect(json).toHaveBeenCalledWith({ message: 'Not Found' })
    expect(status).toHaveBeenCalledWith(404)
  })

  it('handles if query is array', async () => {
    const findUnique = jest.fn().mockReturnValue(mockUser)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: ['first', 'second'] } } as unknown) as NextApiRequest,
      ({ status, json } as unknown) as NextApiResponse
    )
    expect(findUnique).toHaveBeenCalledWith({
      include: { clips: { orderBy: { url: 'asc' }, where: { parentId: null } } },
      where: { username: 'first' },
    })
    expect(json).toHaveBeenCalledWith({
      clips: [
        {
          clips: [
            {
              clips: [],
              parentId: null,
              id: 'clipId2',
              title: 'clipTitle2',
              url: 'clipUrl',
              userId: 1,
              index: 0,
            },
          ],
          id: 'clipId1',
          index: 0,
          parentId: null,
          title: 'clipTitle1',
          url: null,
          userId: 1,
        },
      ],
      id: 1,
      image: 'image',
      name: 'name',
      username: 'username',
    })
  })

  it('recursively calls the getChildren function', async () => {
    const findUnique = jest.fn().mockReturnValue(mockUser)
    const findMany = mocked(PrismaClient.prototype.clip.findMany)
    findMany.mockResolvedValueOnce([
      { id: 'clipId2', index: 0, parentId: null, title: 'clipTitle2', url: 'clipUrl2', userId: 1 },
    ])
    findMany.mockResolvedValueOnce([
      { id: 'clipId3', index: 0, parentId: null, title: 'clipTitle3', url: 'clipUrl3', userId: 1 },
    ])
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.clip = { findMany }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: 'username' } } as unknown) as NextApiRequest,
      ({ status, json } as unknown) as NextApiResponse
    )
    expect(findUnique).toHaveBeenCalledWith({
      where: {
        username: 'username',
      },
      include: {
        clips: {
          where: {
            parentId: null,
          },
          orderBy: {
            url: 'asc',
          },
        },
      },
    })

    expect(findMany).toHaveBeenCalledTimes(5)
    expect(findMany).toHaveBeenNthCalledWith(1, { orderBy: { url: 'asc' }, where: { parentId: 'clipId1' } })
    expect(findMany).toHaveBeenNthCalledWith(5, { orderBy: { url: 'asc' }, where: { parentId: 'clipId3' } })

    expect(json).toHaveBeenCalledWith({
      clips: [
        {
          id: 'clipId1',
          title: 'clipTitle1',
          parentId: null,
          index: 0,
          url: null,
          userId: 1,
          clips: [
            {
              id: 'clipId2',
              title: 'clipTitle2',
              url: 'clipUrl2',
              index: 0,
              parentId: null,
              userId: 1,
              clips: [
                {
                  id: 'clipId3',
                  title: 'clipTitle3',
                  url: 'clipUrl3',
                  index: 0,
                  parentId: null,
                  userId: 1,
                  clips: [],
                },
              ],
            },
          ],
        },
      ],
      id: 1,
      image: 'image',
      name: 'name',
      username: 'username',
    })
  })
})
