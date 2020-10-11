import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { url, folderId } = req.body
  const name = req.body.name && req.body.name !== '' ? req.body.name : url

  if (!url || !folderId) {
    return res.status(400).json({ message: 'Url and folderId is required' })
  }

  const clip = await prisma.clip.create({
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

  return res.status(201).json(clip)
}

export default handler
