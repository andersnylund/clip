import http from 'http'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { NextConnect } from 'next-connect'
import { apiResolver } from 'next/dist/server/api-utils'
import prisma from '../src/prisma'
import { cleanUp, seed } from './db-test-setup'

let server: http.Server

export const setup = async (
  handler: NextApiHandler | NextConnect<NextApiRequest, NextApiResponse>,
  query?: unknown
): Promise<void> => {
  server = http.createServer((req, res) =>
    apiResolver(
      req,
      res,
      query,
      handler,
      { previewModeEncryptionKey: '', previewModeId: '', previewModeSigningKey: '' },
      false
    )
  )
  await seed()
  server.listen(3001)
}

export const teardown = async (): Promise<void> => {
  await cleanUp()
  await prisma.$disconnect()
  server.close()
}
