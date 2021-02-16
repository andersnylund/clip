import { getSession } from 'next-auth/client'
import { mocked } from 'ts-jest/utils'
import route from '../../../src/pages/api/profile'
import prisma from '../../../src/prisma'
import { setup, teardown } from '../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('/api/profile', () => {
  beforeAll(async () => {
    await setup(route)

    const clip = await prisma.clip.findFirst({ where: { user: { email: 'test.user+1@clip.so' } } })
    const user = await prisma.user.findUnique({ where: { email: 'test.user+1@clip.so' } })
    if (user) {
      await prisma.clip.create({
        data: { title: 'child clip', parentId: clip?.id, userId: user.id },
      })
    }
  })

  afterAll(teardown)

  it('returns unauthorized if no session', async () => {
    const response = await fetch(TEST_SERVER_ADDRESS)
    const json = await response.json()
    expect(response.status).toEqual(401)
    expect(json).toEqual({
      message: 'Unauthorized',
    })
  })

  describe('GET', () => {
    it('returns the profile', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toMatchObject({
        clips: [
          {
            title: 'child clip',
          },
        ],
        id: expect.any(Number),
        image: null,
        name: null,
        username: null,
      })
    })

    it('returns 404 if user not found', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test@email.com' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toEqual(404)
      expect(json).toEqual({
        message: 'Not Found',
      })
    })

    it.skip('returns 404 if user email null', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: null }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toEqual(404)
      expect(json).toEqual({
        message: 'Not Found',
      })
    })
  })

  describe('POST', () => {
    it('updates the profile', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({ username: 'new username' }),
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toMatchObject({
        email: 'test.user+1@clip.so',
        emailVerified: null,
        image: null,
        name: null,
        username: 'new username',
      })
    })
  })
})
