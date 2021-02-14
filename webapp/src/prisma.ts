import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

let prisma: PrismaClient

const { NODE_ENV } = process.env

if (NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else if (NODE_ENV === 'test') {
  if (!global.prisma) {
    const output = config({ path: '.env.test' })
    global.prisma = new PrismaClient({ datasources: { db: { url: output.parsed?.DATABASE_URL } } })
  }
  prisma = global.prisma
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
