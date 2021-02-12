import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import route from '../../../../src/pages/api/clip'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

describe('api clips', () => {
  beforeEach(jest.resetAllMocks)

  it('returns unauthorized when no session', async () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route({} as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('returns bad request if no title', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'email' }, expires: '' })

    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route({ body: {} } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ message: 'title is required' })
  })

  it('successfully returns data', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })

    const create = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.clip = { create }

    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route(
      { body: { url: 'url', parentId: 'parentId', title: 'title' } } as NextApiRequest,
      ({ status } as unknown) as NextApiResponse
    )
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(undefined)
    expect(create).toHaveBeenCalledWith({
      data: {
        parent: {
          connect: {
            id: 'parentId',
          },
        },
        url: 'url',
        title: 'title',
        user: {
          connect: {
            email: 'email',
          },
        },
      },
    })
  })
})
