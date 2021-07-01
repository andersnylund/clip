/**
 * @jest-environment node
 */

import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import route from '../../../src/pages/api/clip'
import prisma from '../../../src/prisma'
import { setup, teardown } from '../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('api clips', () => {
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

  it('returns bad request if no title', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const json = await response.json()
    expect(response.status).toEqual(400)
    expect(json).toEqual({
      error: [
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['title'],
          received: 'undefined',
        },
        {
          code: 'invalid_type',
          expected: 'string',
          message: 'Required',
          path: ['url'],
          received: 'undefined',
        },
      ],
    })
  })

  it('returns bad request if url empty string', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'clip without url', url: '' }),
    })
    const json = await response.json()
    expect(response.status).toEqual(400)
    expect(json).toEqual({
      error: [
        {
          code: 'invalid_string',
          message: 'Invalid url',
          path: ['url'],
          validation: 'url',
        },
      ],
    })
  })

  it('successfully creates a folder', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'folder title', url: null }),
    })
    const json = await response.json()
    expect(response.status).toEqual(201)
    expect(json).toMatchObject({
      index: null,
      title: 'folder title',
      url: null,
    })

    const prismaResult = await prisma.clip.findFirst({ where: { title: 'folder title' } })

    expect(prismaResult).toEqual(json)
  })

  it('successfully creates a clip', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'clip title', url: 'https://google.com' }),
    })
    const json = await response.json()
    expect(response.status).toEqual(201)
    expect(json).toMatchObject({
      index: null,
      title: 'clip title',
      url: 'https://google.com',
    })

    const prismaResult = await prisma.clip.findFirst({ where: { title: 'clip title' } })

    expect(prismaResult).toEqual(json)
  })
})
