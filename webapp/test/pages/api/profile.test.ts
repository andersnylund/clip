/**
 * @jest-environment node
 */

import { User } from '@prisma/client'
import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import route from '../../../src/pages/api/profile'
import prisma from '../../../src/prisma'
import { setup, teardown } from '../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('/api/profile', () => {
  let user: User | null

  beforeAll(async () => {
    await setup(route)

    const clip = await prisma.clip.findFirst({ where: { user: { email: 'test.user+1@clip.so' } } })
    user = await prisma.user.findUnique({ where: { email: 'test.user+1@clip.so' } })
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
        username: 'testuser1',
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

  describe('DELETE', () => {
    it('deletes the profile', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

      const userFindUniqueSpy = jest.spyOn(prisma.user, 'findUnique')
      const accountDeleteManySpy = jest.spyOn(prisma.account, 'deleteMany')
      const sessionDeleteManySpy = jest.spyOn(prisma.session, 'deleteMany')
      const deleteClipSpy = jest.spyOn(prisma.clip, 'deleteMany')
      const userDeleteSpy = jest.spyOn(prisma.user, 'delete')

      const response = await fetch(TEST_SERVER_ADDRESS, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })
      expect(response.status).toEqual(204)

      expect(userFindUniqueSpy).toHaveBeenCalledWith({
        where: {
          email: 'test.user+1@clip.so',
        },
      })

      expect(accountDeleteManySpy).toHaveBeenCalledWith({
        where: {
          userId: user?.id,
        },
      })

      expect(deleteClipSpy).toHaveBeenCalledWith({
        where: {
          user: {
            email: 'test.user+1@clip.so',
          },
        },
      })

      expect(sessionDeleteManySpy).toHaveBeenCalledWith({
        where: {
          userId: user?.id,
        },
      })

      expect(userDeleteSpy).toHaveBeenCalledWith({
        where: {
          id: user?.id,
        },
      })
    })

    it('returns 500 if user not found', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null)

      const response = await fetch(TEST_SERVER_ADDRESS, {
        headers: { 'Content-Type': 'application/json' },
        method: 'DELETE',
      })
      expect(response.status).toEqual(500)
    })
  })
})
