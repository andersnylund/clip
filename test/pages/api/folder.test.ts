import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

import route from '../../../src/pages/api/folder'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

jest.mock('@prisma/client')

describe('/api/profile', () => {
  it('returns unauthorized when no session', async () => {
    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route({} as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(401)
    expect(json).toHaveBeenCalledWith({ message: 'Unauthorized' })
  })

  it('returns bad request if no name in body', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue(true)

    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route({ body: {} } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(400)
    expect(json).toHaveBeenCalledWith({ message: 'Name is required' })
  })

  it('sucessfully returns data', async () => {
    const mockGetSession = getSession as jest.Mock
    mockGetSession.mockReturnValue({ user: { email: 'email' } })

    const create = jest.fn()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    PrismaClient.prototype.folder = { create }

    const json = jest.fn()
    const status = jest.fn().mockReturnValue({ json })
    await route({ body: { name: 'name' } } as NextApiRequest, ({ status } as unknown) as NextApiResponse)
    expect(status).toHaveBeenCalledWith(201)
    expect(json).toHaveBeenCalledWith(undefined)
    expect(create).toHaveBeenCalledWith({
      data: {
        name: 'name',
        user: { connect: { email: 'email' } },
      },
    })
  })
})
