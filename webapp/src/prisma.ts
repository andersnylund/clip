/* eslint-disable @typescript-eslint/ban-ts-comment */

import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

const { NODE_ENV, DATABASE_URL } = process.env

if (NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else if (NODE_ENV === 'test') {
  prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
  })
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({ errorFormat: 'pretty' })
  }
  // @ts-ignore
  prisma = global.prisma
}

export default prisma
