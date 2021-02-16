import http from 'http'
import fetchMock from 'jest-fetch-mock'
import { NextApiHandler } from 'next'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import prisma from '../src/prisma'
import { cleanUp, seed } from './db-test-setup'

let server: http.Server

export const setup = async (handler: NextApiHandler): Promise<void> => {
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
}

export const teardown = async (done: () => void): Promise<void> => {
  fetchMock.doMock()
  await cleanUp()
  await prisma.$disconnect()
  server.close(done)
}
