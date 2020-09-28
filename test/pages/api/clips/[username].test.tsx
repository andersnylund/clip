import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, User as PrismaUser, Clip as PrismaClip, Folder as PrismaFolder } from '@prisma/client'

import handler from '../../../../src/pages/api/clips/[username]'

jest.mock('@prisma/client')

const mockUser: PrismaUser & { folders: PrismaFolder[]; clips: PrismaClip[] } = {
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
      folderId: 'folderId',
      id: 'clipId',
      name: 'clipName',
      url: 'clipUrl',
      userId: 1,
    },
  ],
  folders: [
    {
      id: 'folderId',
      name: 'folderName',
      userId: 1,
    },
  ],
}

describe('[username]', () => {
  it('works', async () => {
    const findOne = jest.fn().mockReturnValue(mockUser)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: 'username' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(findOne).toHaveBeenCalledWith({
      include: { clips: true, folders: { include: { clips: true } } },
      where: { username: 'username' },
    })
    expect(json).toHaveBeenCalledWith({
      clips: [
        {
          folderId: 'folderId',
          id: 'clipId',
          name: 'clipName',
          url: 'clipUrl',
          userId: 1,
        },
      ],
      folders: [
        {
          clips: undefined,
          id: 'folderId',
          name: 'folderName',
        },
      ],
      id: 1,
      image: 'image',
      name: 'name',
      username: 'username',
    })
    expect(status).toHaveBeenCalledWith(200)
  })

  it('returns 404 if user not found', async () => {
    const findOne = jest.fn().mockReturnValue(null)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: 'username' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(findOne).toHaveBeenCalledWith({
      include: { clips: true, folders: { include: { clips: true } } },
      where: { username: 'username' },
    })
    expect(json).toHaveBeenCalledWith({ message: 'Not Found' })
    expect(status).toHaveBeenCalledWith(404)
  })

  it('handles if query is array', async () => {
    const findOne = jest.fn().mockReturnValue(mockUser)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne }
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { username: ['first', 'second'] } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(findOne).toHaveBeenCalledWith({
      include: { clips: true, folders: { include: { clips: true } } },
      where: { username: 'first' },
    })
    expect(json).toHaveBeenCalledWith({
      clips: [
        {
          folderId: 'folderId',
          id: 'clipId',
          name: 'clipName',
          url: 'clipUrl',
          userId: 1,
        },
      ],
      folders: [
        {
          clips: undefined,
          id: 'folderId',
          name: 'folderName',
        },
      ],
      id: 1,
      image: 'image',
      name: 'name',
      username: 'username',
    })
    expect(status).toHaveBeenCalledWith(200)
  })
})
