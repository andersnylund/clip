import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient, User as PrismaUser, Clip as PrismaClip, Folder as PrismaFolder } from '@prisma/client'

import route from '../../../src/pages/api/profile'

const mockUser: PrismaUser & { folders: PrismaFolder[]; clips: PrismaClip[] } = {
  createdAt: new Date(),
  email: 'email',
  emailVerified: new Date(),
  id: 1,
  image: 'image',
  name: 'name',
  updatedAt: new Date(),
  username: 'username',
  clips: [],
  folders: [],
}

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

describe('/api/profile', () => {
  it('returns unauthorized if no session', async () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route({ method: 'GET' } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  describe('GET', () => {
    it('returns the profile', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'test@email.com' } })

      const findUnique = jest.fn().mockReturnValue(mockUser)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique }

      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })
      await route({ method: 'GET' } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
      expect(PrismaClient.prototype.user.findUnique).toHaveBeenCalledWith({
        include: {
          folders: {
            orderBy: {
              orderIndex: 'asc',
            },
            include: {
              clips: {
                orderBy: {
                  orderIndex: 'asc',
                },
              },
            },
          },
        },
        where: {
          email: 'test@email.com',
        },
      })
      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith({
        folders: [],
        id: 1,
        image: 'image',
        name: 'name',
        username: 'username',
      })
    })

    it('returns 404 if user not found', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'test@email.com' } })

      const findUnique = jest.fn().mockReturnValue(null)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique }

      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })
      await route({ method: 'GET' } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ message: 'Not Found' })
    })

    it('returns 404 if user email null', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: null } })

      const findUnique = jest.fn().mockReturnValue(null)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { findUnique }

      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })
      await route({ method: 'GET' } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
      expect(status).toHaveBeenCalledWith(404)
      expect(json).toHaveBeenCalledWith({ message: 'Not Found' })
    })
  })

  describe('POST', () => {
    it('updates with correct values 404 if user email is null', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: undefined } })

      const update = jest.fn().mockReturnValue(mockUser)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { update }

      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })
      await route(
        { method: 'POST', body: { username: 'new username' } } as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(status).toHaveBeenCalledWith(200)
      expect(update).toHaveBeenCalledWith({
        data: {
          username: 'new username',
        },
        where: {
          email: undefined,
        },
      })
    })

    it('updates the profile', async () => {
      const mockGetSession = getSession as jest.Mock
      mockGetSession.mockReturnValue({ user: { email: 'test@email.com' } })

      const update = jest.fn().mockReturnValue(mockUser)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      PrismaClient.prototype.user = { update }

      const json = jest.fn()
      const status = jest.fn().mockReturnValue({ json })
      await route(
        { method: 'POST', body: { username: 'new username' } } as NextApiRequest,
        ({ status } as unknown) as NextApiResponse
      )
      expect(status).toHaveBeenCalledWith(200)
      expect(json).toHaveBeenCalledWith(mockUser)
    })
  })
})
