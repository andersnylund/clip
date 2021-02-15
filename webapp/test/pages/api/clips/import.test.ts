/**
 * @jest-environment node
 */

import http from 'http'
import fetchMock from 'jest-fetch-mock'
import { getSession } from 'next-auth/client'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import { mocked } from 'ts-jest/utils'
import handler, { SimpleClip } from '../../../../src/pages/api/clips/import'
import prisma from '../../../../src/prisma'
import { cleanUp, seed } from '../../../db-test-setup'
import { TEST_SERVER_ADDRESS } from '../../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('import', () => {
  let server: http.Server

  beforeAll(async () => {
    fetchMock.dontMock()
    server = http.createServer((req, res) =>
      apiResolver(
        req,
        res,
        undefined,
        handler,
        { previewModeEncryptionKey: '', previewModeId: '', previewModeSigningKey: '' },
        false
      )
    )
    await seed()
    server.listen(3001)
  })

  afterAll(async (done) => {
    fetchMock.doMock()
    await cleanUp()
    await prisma.$disconnect()
    server.close(done)
  })

  it('imports the clips successfully', async () => {
    mocked(getSession).mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const simpleClips: SimpleClip[] = [
      {
        clips: [],
        id: 'clipId',
        index: null,
        parentId: null,
        title: 'clipTitle',
        url: null,
      },
    ]

    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clips: simpleClips }),
    })
    const json = await response.json()
    expect(json[0]).toHaveProperty('title', 'clipTitle')
  })

  it('handles if user email is null', async () => {
    mocked(getSession).mockResolvedValue({ user: { email: null }, expires: '' })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clips: [] }),
    })
    const json = await response.json()
    expect(response.status).toEqual(401)
    expect(json).toEqual({ message: 'Unauthorized' })
  })

  it('imports the clips successfully', async () => {
    mocked(getSession).mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const simpleClips: SimpleClip[] = [
      {
        clips: [
          {
            clips: [],
            id: 'clipId1',
            index: null,
            parentId: 'clipId',
            title: 'clipTitle1',
            url: null,
            userId: 1,
          },
        ],
        id: 'clipId',
        index: null,
        parentId: null,
        title: 'clipTitle',
        url: null,
      },
    ]

    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clips: simpleClips }),
    })
    const json = await response.json()
    expect(json[0]).toHaveProperty('title', 'clipTitle')
  })

  it('return bad request if no clips in body', async () => {
    mocked(getSession).mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'no clips in body' }),
    })
    const json = await response.json()
    expect(response.status).toEqual(400)
    expect(json).toEqual({ message: 'clips are required in the body' })
  })

  it('returns unauthorized if no valid session', async () => {
    mocked(getSession).mockResolvedValue(null)
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'no clips in body' }),
    })
    const json = await response.json()
    expect(json).toEqual({ message: 'Unauthorized' })
  })
})
