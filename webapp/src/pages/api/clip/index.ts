import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { url, parentId } = req.body
  const title = req.body.title && req.body.title !== '' ? req.body.title : url

  const clip = await prisma.clip.create({
    data: {
      title,
      url,
      parent: parentId
        ? {
            connect: {
              id: parentId,
            },
          }
        : undefined,
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
