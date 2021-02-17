import fetch from 'node-fetch'
import route from '../../../../src/pages/api/clips/[username]'
import prisma from '../../../../src/prisma'
import { setup, teardown } from '../../../integration-test-hooks'
import { TEST_SERVER_ADDRESS } from '../../../setup'

describe('username api', () => {
  describe('successfull query', () => {
    beforeAll(async () => {
      await setup(route, { username: 'testuser1' })
      const clip = await prisma.clip.create({
        data: { title: 'clip', user: { connect: { email: 'test.user+1@clip.so' } } },
      })
      await prisma.clip.create({
        data: {
          title: 'child',
          user: { connect: { email: 'test.user+1@clip.so' } },
          parent: { connect: { id: clip.id } },
        },
      })
    })
    afterAll(teardown)

    it('gets the user clips', async () => {
      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toBe(200)
      expect(json).toMatchObject({
        clips: [
          {
            title: 'clip',
          },
        ],
        image: null,
        name: null,
        username: 'testuser1',
      })
    })
  })

  describe('not found query', () => {
    beforeAll(async () => {
      await setup(route, { username: 'notfound' })
    })
    afterAll(teardown)

    it('returns 404 if user not found', async () => {
      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toBe(404)
      expect(json).toMatchObject({
        message: 'Not Found',
      })
    })
  })

  describe('array query', () => {
    beforeAll(async () => {
      await setup(route, { username: ['first', 'second'] })
    })
    afterAll(teardown)

    it('returns 404 if user not found', async () => {
      const response = await fetch(TEST_SERVER_ADDRESS)
      const json = await response.json()
      expect(response.status).toBe(404)
      expect(json).toMatchObject({
        message: 'Not Found',
      })
    })
  })
})
