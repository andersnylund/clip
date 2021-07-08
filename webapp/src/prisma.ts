/* eslint-disable @typescript-eslint/ban-ts-comment */

import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient

const { NODE_ENV, DATABASE_URL } = process.env

if (NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({
      errorFormat: 'pretty',
      ...(NODE_ENV === 'test' ? { datasources: { db: { url: DATABASE_URL } } } : {}),
    })
  }
  // @ts-ignore
  prisma = global.prisma
}

export default prisma
