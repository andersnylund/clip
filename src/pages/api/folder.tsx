import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  const folder = await prisma.folder.create({
    data: {
      name,
      user: {
        connect: {
          email: session.user.email,
        },
      },
    },
  })

  return res.status(201).json(folder)
}
