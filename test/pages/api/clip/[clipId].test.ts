import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import handler from '../../../../src/pages/api/clip/[clipId]'
import { Clip, User } from '../../../../src/types'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

const mockClips: Clip[] = [
  {
    folderId: 'folderId1',
    id: 'clipId1',
    name: 'clipName1',
    orderIndex: 0,
    url: 'clipUrl1',
  },
  {
    folderId: 'folderId1',
    id: 'clipId2',
    name: 'clipName2',
    orderIndex: 1,
    url: 'clipUrl2',
  },
]

const mockUser: User = {
  folders: [
    {
      clips: mockClips,
      id: 'folderId',
      name: 'folderName',
    },
  ],
  id: 0,
  image: null,
  name: null,
  username: null,
}

describe('[clipId]', () => {
  it('returns 401 if unauthorized', async () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler({} as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('returns 400 with invalid query', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue(true)
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ query: { clipId: ['first', 'second'] } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ message: 'Invalid query' })
  })

  it('returns 404 if unknown method', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue(true)
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await handler(
      ({ method: 'GET', query: { clipId: 'clipId1' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ message: 'Not found' })
  })

  it('returns 404 if user has null email', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: null } })
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    const findOneUser = jest.fn(() => ({ id: 1 }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne: findOneUser }
    const findOneClip = jest.fn(() => undefined)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.clip = { findOne: findOneClip }
    await handler(
      ({ method: 'DELETE', query: { clipId: 'clipId1' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(findOneUser).toHaveBeenCalledWith({
      where: {
        email: undefined,
      },
    })
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ message: 'Clip not found' })
  })

  describe('DELETE', () => {
    it('deletes a clip', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const end = jest.fn()
      const status = jest.fn().mockReturnValue({ end })

      const findOneUser = jest.fn(() => ({ id: 1 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }
      const findOneClip = jest.fn(() => ({ folder: { userId: 1 } }))
      const deleteClip = jest.fn()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findOne: findOneClip, delete: deleteClip }

      await handler(
        ({ query: { clipId: 'clipId1' }, method: 'DELETE' } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(deleteClip).toHaveBeenCalledWith({ where: { id: undefined } })
      expect(status).toHaveBeenCalledWith(204)
      expect(end).toHaveBeenCalled()
    })

    it("doesn't allow to remove someones elses clip", async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findOneUser = jest.fn(() => ({ id: 2 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }
      const findOneClip = jest.fn(() => ({ folder: { userId: 1 } }))
      const deleteClip = jest.fn()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findOne: findOneClip, delete: deleteClip }

      await handler(
        ({ query: { clipId: 'clipId1' }, method: 'DELETE' } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(deleteClip).not.toHaveBeenCalled()
      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ message: 'Clip not found' })
    })
  })

  describe('PUT', () => {
    it('returns 404 if clip is not owned by user', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findOneUser = jest.fn(() => ({ ...mockUser, id: 1 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }
      const findOneClip = jest.fn(() => mockClips[0])
      const updateClip = jest.fn()
      const findMany = jest.fn(() => mockClips)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findOne: findOneClip, update: updateClip, findMany }

      await handler(
        ({ method: 'PUT', query: { clipId: 'clipId1' }, body: { orderIndex: 1 } } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )

      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({
        message: 'Clip not found',
      })

      expect(updateClip).not.toHaveBeenCalled()
    })

    it('updates ordering of clip', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'email' } })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findOneUser = jest.fn(() => mockUser)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findOne: findOneUser }
      const findOneClip = jest.fn(() => ({ ...mockClips[0], folder: { userId: mockUser.id, folderId: 'folderId1' } }))
      const updateClip = jest.fn()
      const findMany = jest.fn(() => mockClips)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findOne: findOneClip, update: updateClip, findMany }

      await handler(
        ({
          method: 'PUT',
          query: { clipId: 'clipId1' },
          body: { orderIndex: 1, folderId: 'folderId1' },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        folderId: 'folderId1',
        id: 'clipId1',
        name: 'clipName1',
        orderIndex: 0,
        url: 'clipUrl1',
        folder: {
          folderId: 'folderId1',
          userId: 0,
        },
      })

      expect(updateClip).toHaveBeenCalledTimes(3)

      expect(updateClip).toHaveBeenNthCalledWith(1, {
        data: {
          folder: {
            connect: {
              id: 'folderId1',
            },
          },
        },
        where: {
          id: 'clipId1',
        },
      })

      expect(updateClip).toHaveBeenNthCalledWith(2, {
        data: {
          orderIndex: 0,
        },
        where: {
          id: 'clipId2',
        },
      })
      expect(updateClip).toHaveBeenNthCalledWith(3, {
        data: {
          orderIndex: 1,
        },
        where: {
          id: 'clipId1',
        },
      })
    })
  })
})
