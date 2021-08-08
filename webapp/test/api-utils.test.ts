/**
 * @jest-environment node
 */

import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import nc from 'next-connect'
import { mocked } from 'ts-jest/utils'
import { updateSyncId, onError, onNoMatch, authorizedRoute } from '../src/api-utils'
import prisma from '../src/prisma'
import { setup, teardown } from './integration-test-hooks'
import { TEST_SERVER_ADDRESS } from './setup'
import fetch from 'node-fetch'

const newUUID = 'f4914671-0acc-49bb-b431-59e23877fea4'

jest.mock('uuid', () => ({
  v4: () => newUUID,
}))

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

const testHandler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .use(updateSyncId)
  .post(async (req, res) => {
    return res.status(200).json({ message: 'yay!' })
  })

describe('api-utils', () => {
  describe('updateSyncId', () => {
    beforeEach(async () => {
      await setup(testHandler)
    })
    afterEach(teardown)

    it('updates the sync id if sync enabled', async () => {
      const syncId = '16c27ddd-b0b0-45da-8548-e8f8ffcbab8e'

      await prisma.user.update({
        data: { syncEnabled: true, syncId },
        where: {
          email: 'test.user+1@clip.so',
        },
      })

      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
      const response = await fetch(`${TEST_SERVER_ADDRESS}`, { method: 'POST' })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toEqual({
        message: 'yay!',
      })

      const updatedUser = await prisma.user.findUnique({ where: { email: 'test.user+1@clip.so' } })
      expect(updatedUser?.syncId).toEqual(newUUID)
    })

    it('does no update the sync id if sync disabled', async () => {
      const syncId = '16c27ddd-b0b0-45da-8548-e8f8ffcbab8e'

      await prisma.user.update({
        data: { syncEnabled: false, syncId },
        where: {
          email: 'test.user+1@clip.so',
        },
      })

      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
      const response = await fetch(`${TEST_SERVER_ADDRESS}`, { method: 'POST' })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toEqual({
        message: 'yay!',
      })

      const updatedUser = await prisma.user.findUnique({ where: { email: 'test.user+1@clip.so' } })
      expect(updatedUser?.syncId).toEqual(syncId)
    })
  })
})
