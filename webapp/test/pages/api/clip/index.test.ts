/**
 * @jest-environment node
 */

import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import route from '../../../../src/pages/api/clip'
import prisma from '../../../../src/prisma'
import { setup, teardown } from '../../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../../setup'

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
      message: 'Unauthorized',
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
      message: 'title is required',
    })
  })

  it('successfully returns data', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

    const parentClip = await prisma.clip.create({
      data: { title: 'parent', user: { connect: { email: 'test.user+1@clip.so' } } },
    })

    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'clip title', parentId: parentClip.id }),
    })
    const json = await response.json()
    expect(response.status).toEqual(201)
    expect(json).toMatchObject({
      index: null,
      title: 'clip title',
      url: null,
    })

    const prismaResult = await prisma.clip.findFirst({ where: { title: 'clip title' } })

    expect(prismaResult).toEqual(json)
  })

  it('does not add the parent id to the data if not provided', async () => {
    const mockGetSession = mocked(getSession)
    mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })

    const response = await fetch(TEST_SERVER_ADDRESS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'clip title 2' }),
    })
    const json = await response.json()
    expect(response.status).toEqual(201)
    expect(json).toMatchObject({
      parentId: null,
      index: null,
      title: 'clip title 2',
      url: null,
    })

    const prismaResult = await prisma.clip.findFirst({ where: { title: 'clip title 2' } })

    expect(prismaResult).toEqual(json)
  })
})
