import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

import handler, { CompletePrismaUser } from '../../../../src/pages/api/clips/[username]'

jest.mock('@prisma/client')

const mockUser: CompletePrismaUser = {
  createdAt: new Date(),
  email: 'email',
  emailVerified: new Date(),
  id: 1,
  image: 'image',
  name: 'name',
  updatedAt: new Date(),
  username: 'username',
  folders: [
    {
      id: 'folderId',
      name: 'folderName',
      userId: 1,
      orderIndex: 0,
      clips: [
        {
          folderId: 'folderId',
          id: 'clipId',
          name: 'clipName',
          url: 'clipUrl',
          orderIndex: 0,
        },
      ],
    },
  ],
}

describe('[username]', () => {
  it('works', async () => {
    const findUnique = jest.fn().mockReturnValue(mockUser)
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
      include: { folders: { include: { clips: true } } },
      where: { username: 'username' },
    })
    expect(json).toHaveBeenCalledWith({
      folders: [
        {
          id: 'folderId',
          name: 'folderName',
          clips: [
            {
              folderId: 'folderId',
              id: 'clipId',
              name: 'clipName',
              url: 'clipUrl',
              orderIndex: 0,
            },
          ],
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
      include: { folders: { include: { clips: true } } },
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
      ({ status } as unknown) as NextApiResponse
    )
    expect(findUnique).toHaveBeenCalledWith({
      include: { folders: { include: { clips: true } } },
      where: { username: 'first' },
    })
    expect(json).toHaveBeenCalledWith({
      folders: [
        {
          clips: [
            {
              folderId: 'folderId',
              id: 'clipId',
              name: 'clipName',
              url: 'clipUrl',
              orderIndex: 0,
            },
          ],
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
