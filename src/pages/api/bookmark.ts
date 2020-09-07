import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { name, url, folderId } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  const bookmark = await prisma.bookmark.create({
    data: {
      folder: {
        connect: {
          id: folderId,
        },
      },
      name,
      url,
      user: {
        connect: {
          email: session.user.email,
        },
      },
    },
  })

  return res.status(201).json(bookmark)
}

export default handler
