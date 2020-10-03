import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'

import handler from '../../../../src/pages/api/clip/[clipId]'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

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

  it('returns 404 if method not DELETE', async () => {
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

  it('deletes a clip', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })
    const end = jest.fn()
    const status = jest.fn().mockReturnValue({ end })

    const findOneUser = jest.fn(() => ({ id: 1 }))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.user = { findOne: findOneUser }
    const findOneClip = jest.fn(() => ({ userId: 1 }))
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
    const findOneClip = jest.fn(() => ({ userId: 1 }))
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
