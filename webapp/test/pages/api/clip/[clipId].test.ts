import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'

import handler from '../../../../src/pages/api/clip/[clipId]'
import { Clip, User } from '../../../../src/types'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

const mockClips: Clip[] = [
  {
    parentId: null,
    id: 'clipId1',
    title: 'clipName1',
    index: 0,
    url: 'clipUrl1',
    clips: [],
    userId: 1,
  },
  {
    parentId: null,
    id: 'clipId2',
    title: 'clipName2',
    index: 1,
    url: 'clipUrl2',
    clips: [],
    userId: 1,
  },
]

const mockUser: User = {
  clips: mockClips,
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
    const findUniqueUser = jest.fn(() => ({ id: 1 }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findUnique: findUniqueUser }
    const findUniqueClip = jest.fn(() => undefined)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.clip = { findUnique: findUniqueClip }
    await handler(
      ({ method: 'DELETE', query: { clipId: 'clipId1' } } as unknown) as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(findUniqueUser).toHaveBeenCalledWith({
      where: {
        email: undefined,
      },
    })
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({ message: 'Clip not found' })
  })

  describe('DELETE', () => {
    it('deletes a clip', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })
      const end = jest.fn()
      const status = jest.fn().mockReturnValue({ end })

      const findUniqueUser = jest.fn(() => ({ id: 1 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }
      const findUniqueClip = jest.fn()
      const clip: Clip = { id: 'id', index: 0, parentId: null, title: 'title', url: null, clips: [], userId: 1 }
      findUniqueClip.mockResolvedValue(clip)
      const deleteClip = jest.fn()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findUnique: findUniqueClip, delete: deleteClip }

      await handler(
        ({ query: { clipId: 'clipId1' }, method: 'DELETE' } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(deleteClip).toHaveBeenCalledWith({ where: { id: 'id' } })
      expect(status).toHaveBeenCalledWith(204)
      expect(end).toHaveBeenCalled()
    })

    it("doesn't allow to remove someones elses clip", async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => ({ id: 2 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }
      const findUniqueClip = jest.fn(() => ({ folder: { userId: 1 } }))
      const deleteClip = jest.fn()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findUnique: findUniqueClip, delete: deleteClip }

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
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => ({ ...mockUser, id: 0 }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }
      const findUniqueClip = jest.fn(() => mockClips[0])
      const updateClip = jest.fn()
      const findMany = jest.fn(() => mockClips)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findUnique: findUniqueClip, update: updateClip, findMany }

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

    it('updates clip without parent', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => mockUser)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const updateClip = jest.fn(() => mockClips[1])
      const findMany = jest.fn(() => mockClips)
      const findUnique = jest.fn()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findUnique: findUnique, update: updateClip, findMany }
      const findUniqueClip = mocked(PrismaClient.prototype.clip.findUnique)
      findUniqueClip.mockResolvedValue({
        ...mockClips[0],
        userId: 0,
      })
      await handler(
        ({ method: 'PUT', query: { clipId: 'clipId1' }, body: { title: 'title' } } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        clips: [],
        id: 'clipId2',
        index: 1,
        parentId: null,
        title: 'clipName2',
        url: 'clipUrl2',
        userId: 1,
      })

      expect(updateClip).toHaveBeenCalledTimes(1)

      expect(updateClip).toHaveBeenCalledWith({
        data: {
          parent: {},
          title: 'title',
        },
        where: {
          id: 'clipId1',
        },
      })
    })

    it('disconnect parent of clip', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => mockUser)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const updateClip = jest.fn(() => mockClips[1])
      const findMany = jest.fn(() => mockClips)
      const findUnique = jest.fn()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findUnique: findUnique, update: updateClip, findMany }
      const findUniqueClip = mocked(PrismaClient.prototype.clip.findUnique)
      findUniqueClip.mockResolvedValue({
        ...mockClips[0],
        userId: 0,
        parentId: 'parentId',
      })
      await handler(
        ({
          method: 'PUT',
          query: { clipId: 'clipId1' },
          body: { parentId: undefined, title: 'title' },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        clips: [],
        id: 'clipId2',
        index: 1,
        parentId: null,
        title: 'clipName2',
        url: 'clipUrl2',
        userId: 1,
      })

      expect(updateClip).toHaveBeenCalledTimes(1)

      expect(updateClip).toHaveBeenCalledWith({
        data: {
          parent: {
            disconnect: true,
          },
          title: 'title',
        },
        where: {
          id: 'clipId1',
        },
      })
    })

    it('connect clip to a parent', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })
      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })

      const findUniqueUser = jest.fn(() => mockUser)

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique: findUniqueUser }

      const updateClip = jest.fn(() => mockClips[1])
      const findMany = jest.fn(() => mockClips)
      const findUnique = jest.fn()

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.clip = { findUnique: findUnique, update: updateClip, findMany }
      const findUniqueClip = mocked(PrismaClient.prototype.clip.findUnique)
      findUniqueClip.mockResolvedValue({
        ...mockClips[0],
        userId: 0,
        parentId: 'parentId',
      })
      await handler(
        ({
          method: 'PUT',
          query: { clipId: 'clipId1' },
          body: { parentId: 'parentId', title: 'title' },
        } as unknown) as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )

      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        clips: [],
        id: 'clipId2',
        index: 1,
        parentId: null,
        title: 'clipName2',
        url: 'clipUrl2',
        userId: 1,
      })

      expect(updateClip).toHaveBeenCalledTimes(1)

      expect(updateClip).toHaveBeenCalledWith({
        data: {
          parent: {
            connect: {
              id: 'parentId',
            },
          },
          title: 'title',
        },
        where: {
          id: 'clipId1',
        },
      })
    })
  })
})
