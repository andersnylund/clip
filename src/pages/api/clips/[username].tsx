import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { username: usernameQuery } = req.query
  const username = typeof usernameQuery === 'string' ? usernameQuery : usernameQuery[0]

  const user = await prisma.user.findOne({
    where: {
      username,
    },
    include: { Bookmark: true, Folder: true },
  })

  if (user) {
    res.status(200).json(user)
  } else {
    res.status(404).json({ message: 'Not Found' })
  }
}
