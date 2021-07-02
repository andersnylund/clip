/**
 * @jest-environment node
 */

import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import { SimpleClip } from '../../../../src/api-utils'
import handler from '../../../../src/pages/api/clips/import'
import { setup, teardown } from '../../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('import', () => {
  beforeAll(async () => {
    await setup(handler)
  })
  afterAll(teardown)

  beforeEach(() => {
    jest.resetAllMocks()
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
    expect(json).toEqual({ error: 'Unauthorized' })
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
            collapsed: true,
          },
        ],
        id: 'clipId',
        index: null,
        parentId: null,
        title: 'clipTitle',
        url: null,
        collapsed: true,
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

  it('returns bad request if no clips in body', async () => {
    mocked(getSession).mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'no clips in body' }),
    })
    const json = await response.json()
    expect(response.status).toEqual(400)
    expect(json).toEqual({ error: 'clips are required in the body' })
  })

  it('returns unauthorized if no valid session', async () => {
    mocked(getSession).mockResolvedValue(null)
    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'no clips in body' }),
    })
    const json = await response.json()
    expect(json).toEqual({ error: 'Unauthorized' })
  })
})
