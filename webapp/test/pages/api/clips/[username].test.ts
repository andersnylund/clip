import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

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
      id: 'folderId',
      title: 'folderName',
      userId: 1,
      parentId: null,
      index: 0,
      url: null,
      clips: [
        {
          id: 'clipId',
          title: 'clipName',
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
          id: 'folderId',
          title: 'folderName',
          parentId: null,
          index: 0,
          url: null,
          clips: [
            {
              id: 'clipId',
              title: 'clipName',
              url: 'clipUrl',
              index: 0,
              parentId: null,
              clips: [],
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
              id: 'clipId',
              title: 'clipName',
              url: 'clipUrl',
              index: 0,
            },
          ],
          id: 'folderId',
          index: 0,
          parentId: null,
          title: 'folderName',
          url: null,
        },
      ],
      id: 1,
      image: 'image',
      name: 'name',
      username: 'username',
    })
  })
})
