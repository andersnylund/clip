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
import { TEST_SERVER_ADDRESS } from '../../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('import', () => {
  let server: http.Server

  beforeAll(() => {
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
    server.listen(3001)
  })

  afterAll(async (done) => {
    fetchMock.doMock()
    await prisma.$disconnect()
    server.close(done)
  })

  it('works', async () => {
    mocked(getSession).mockResolvedValue({ user: { email: 'anders@andersnylund.com' }, expires: '' })
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
  })
})
