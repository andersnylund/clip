import { PrismaClient } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const result = await prisma.user.create({
    data: {
      email: 'test@test.com',
    },
  })
  res.json(result)
}
