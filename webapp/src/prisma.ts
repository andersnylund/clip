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
  if (!global.prisma) {
    global.prisma = new PrismaClient({ errorFormat: 'pretty' })
  }
  prisma = global.prisma
}

export default prisma
