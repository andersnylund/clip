/**
 * @jest-environment node
 */

import { Clip } from '@prisma/client'
import { getSession } from 'next-auth/client'
import fetch from 'node-fetch'
import { mocked } from 'ts-jest/utils'
import route from '../../../../src/pages/api/clip/[clipId]'
import prisma from '../../../../src/prisma'
import { setup, teardown } from '../../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../../setup'

jest.mock('next-auth/client', () => ({
  getSession: jest.fn(),
}))

describe('[clipId]', () => {
  describe('index route', () => {
    beforeAll(() => setup(route, { clipId: 'clipId' }))
    afterAll(teardown)

    it('returns 401 if unauthorized', async () => {
      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toEqual(401)
      expect(json).toEqual({
        error: 'Unauthorized',
      })
    })
  })

  describe('POST', () => {
    beforeEach(async () => {
      const clip = await prisma.clip.create({
        data: { title: 'clip to update', user: { create: { email: 'temporary.user@clip.so' } } },
      })
      await setup(route, { clipId: clip.id })
    })
    afterEach(teardown)

    it('returns 404 if unknown method', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })
      const response = await fetch(`${TEST_SERVER_ADDRESS}`, { method: 'POST' })
      const json = await response.json()
      expect(response.status).toEqual(404)
      expect(json).toEqual({
        error: 'Not found',
      })
    })
  })

  describe('DELETE', () => {
    let clipId: string
    let userId: number

    beforeEach(async () => {
      const clip = await prisma.clip.create({
        data: { title: 'clip to delete', user: { create: { email: 'temporary.user@clip.so' } } },
      })
      userId = clip.userId
      clipId = clip.id
      await setup(route, { clipId: clip.id })
    })
    afterEach(teardown)

    it('deletes a clip', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, { method: 'DELETE' })
      expect(response.status).toEqual(204)

      const clip = await prisma.clip.findUnique({ where: { id: clipId } })
      expect(clip).toBeNull()
    })

    it('deletes clips recursively', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const notDeleted = await prisma.clip.create({
        data: {
          title: 'this should not be deleted',
          parentId: null,
          userId,
        },
      })

      await prisma.clip.create({
        data: {
          title: 'child1',
          parentId: clipId,
          userId,
        },
      })

      const response = await fetch(TEST_SERVER_ADDRESS, { method: 'DELETE' })
      expect(response.status).toEqual(204)

      const clips = await prisma.clip.findMany()
      expect(clips).toEqual([notDeleted])
    })

    it("doesn't allow to remove someones elses clip", async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'hacker.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, { method: 'DELETE' })
      const json = await response.json()
      expect(response.status).toEqual(404)
      expect(json).toEqual({
        error: 'Clip not found',
      })
    })
  })

  describe('PUT', () => {
    let clip: Clip

    beforeEach(async () => {
      clip = await prisma.clip.create({
        data: { title: 'clip to update', user: { create: { email: 'temporary.user@clip.so' } } },
      })
      await setup(route, { clipId: clip.id })
    })
    afterEach(teardown)

    it('returns 404 if clip is not owned by user', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'hacker.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, { method: 'PUT' })
      const json = await response.json()
      expect(response.status).toEqual(404)
      expect(json).toEqual({
        error: 'Clip not found',
      })
    })

    it('updates clip without parent', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, { method: 'PUT' })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toMatchObject({
        title: 'clip to update',
      })
    })

    it('disconnects parent of clip', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, { method: 'PUT' })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toMatchObject({
        title: 'clip to update',
      })
    })

    it('connects clip to a parent', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const parentClip = await prisma.clip.create({
        data: { title: 'parent', user: { connect: { email: 'temporary.user@clip.so' } } },
      })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        method: 'PUT',
        body: JSON.stringify({ parentId: parentClip.id }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json.parentId).not.toBeNull()
    })

    it('disconnects clip from parent', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const parentClip = await prisma.clip.create({
        data: { title: 'parent', user: { connect: { email: 'temporary.user@clip.so' } } },
      })

      await prisma.clip.update({ where: { id: clip.id }, data: { parentId: parentClip.id } })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        method: 'PUT',
        body: JSON.stringify({ parentId: null }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json.parentId).toBeNull()
    })

    it('updates the clip title and url', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        method: 'PUT',
        body: JSON.stringify({ url: 'new url', title: 'new title' }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json.url).toEqual('new url')
      expect(json.title).toEqual('new title')

      const updatedClip = await prisma.clip.findUnique({ where: { id: clip.id } })
      expect(updatedClip).toEqual({
        id: expect.any(String),
        collapsed: true,
        index: null,
        parentId: null,
        title: 'new title',
        url: 'new url',
        userId: expect.any(Number),
      })
    })

    it('updates the clip collapsed state', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        method: 'PUT',
        body: JSON.stringify({ collapsed: false }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json.collapsed).toEqual(false)

      const updatedClip = await prisma.clip.findUnique({ where: { id: clip.id } })
      expect(updatedClip).toEqual({
        id: expect.any(String),
        collapsed: false,
        index: null,
        parentId: null,
        title: 'clip to update',
        url: null,
        userId: expect.any(Number),
      })
    })
  })

  describe('PUT clip index', () => {
    let clip2Id: string
    let userId: number

    beforeEach(async () => {
      const clip1 = await prisma.clip.create({
        data: { title: 'clip to update index of', user: { create: { email: 'temporary.user@clip.so' } } },
      })
      const clip2 = await prisma.clip.create({
        data: { title: 'clip number 2', user: { connect: { id: clip1.userId } } },
      })
      clip2Id = clip2.id
      userId = clip1.userId
      await setup(route, { clipId: clip1.id })
    })
    afterEach(teardown)

    it('updates the clip indices', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        method: 'PUT',
        body: JSON.stringify({ index: 1 }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toEqual({
        id: expect.any(String),
        collapsed: true,
        index: 1,
        parentId: null,
        title: 'clip to update index of',
        url: null,
        userId: expect.any(Number),
      })

      const updatedClips = await prisma.clip.findMany({ where: { userId: userId }, orderBy: { index: 'asc' } })
      expect(updatedClips).toEqual([
        {
          id: expect.any(String),
          collapsed: true,
          index: 0,
          parentId: null,
          title: 'clip number 2',
          url: null,
          userId: expect.any(Number),
        },
        {
          id: expect.any(String),
          collapsed: true,
          index: 1,
          parentId: null,
          title: 'clip to update index of',
          url: null,
          userId: expect.any(Number),
        },
      ])
    })

    it('updates the clip index of one', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'temporary.user@clip.so' }, expires: '' })

      await prisma.clip.delete({ where: { id: clip2Id } })

      const response = await fetch(TEST_SERVER_ADDRESS, {
        method: 'PUT',
        body: JSON.stringify({ index: 1 }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const json = await response.json()
      expect(response.status).toEqual(200)
      expect(json).toEqual({
        id: expect.any(String),
        collapsed: true,
        index: 1,
        parentId: null,
        title: 'clip to update index of',
        url: null,
        userId: expect.any(Number),
      })

      const updatedClips = await prisma.clip.findMany({ where: { userId: userId } })
      expect(updatedClips).toEqual([
        {
          id: expect.any(String),
          collapsed: true,
          index: 1,
          parentId: null,
          title: 'clip to update index of',
          url: null,
          userId: expect.any(Number),
        },
      ])
    })
  })

  describe('invalid query', () => {
    beforeEach(async () => {
      await setup(route, { clipId: {} })
    })
    afterEach(teardown)

    it('returns 400 with invalid query', async () => {
      const mockGetSession = mocked(getSession)
      mockGetSession.mockResolvedValue({ user: { email: 'test.user+1@clip.so' }, expires: '' })
      const response = await fetch(`${TEST_SERVER_ADDRESS}`)
      const json = await response.json()
      expect(response.status).toEqual(400)
      expect(json).toEqual({
        error: 'Invalid query',
      })
    })
  })
})
