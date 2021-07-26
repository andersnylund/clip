/**
 * @jest-environment node
 */

import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import route from '../../../../src/pages/api/profile/toggle-sync'
import prisma from '../../../../src/prisma'
import { setup, teardown } from '../../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../../setup'
import { v4 as uuidv4 } from 'uuid'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('/toggle-sync', () => {
  beforeAll(async () => {
    await setup(route)
  })
  afterAll(teardown)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns unauthorized when no session', async () => {
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clips: [] }),
    })
    const json = await response.json()
    expect(response.status).toEqual(401)
    expect(json).toEqual({
      error: 'Unauthorized',
    })
  })

  it('returns bad request if invalid body', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const json = await response.json()
    expect(response.status).toEqual(400)
    expect(json).toEqual({
      error: {
        issues: [
          {
            code: 'invalid_type',
            expected: 'boolean',
            message: 'Required',
            path: ['syncEnabled'],
            received: 'undefined',
          },
          {
            code: 'invalid_type',
            expected: 'string',
            message: 'Required',
            path: ['syncId'],
            received: 'undefined',
          },
        ],
      },
    })
  })

  it('enables syncing', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const uuid = uuidv4()
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncEnabled: true, syncId: uuid }),
    })
    const json = await response.json()
    expect(response.status).toEqual(200)
    expect(json).toMatchObject({
      email: 'test.user+1@clip.so',
      emailVerified: null,
      image: null,
      name: null,
      syncEnabled: true,
      syncId: uuid,
      username: 'testuser1',
    })
  })

  it('disables syncing', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const user = await prisma.user.update({
      where: { email: 'test.user+1@clip.so' },
      data: { syncEnabled: true, syncId: uuidv4() },
    })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ syncEnabled: false, syncId: null }),
    })
    const json = await response.json()
    expect(response.status).toEqual(200)
    expect(json).toMatchObject({
      email: 'test.user+1@clip.so',
      emailVerified: null,
      image: null,
      name: null,
      syncEnabled: false,
      syncId: null,
      username: 'testuser1',
    })
  })
})
