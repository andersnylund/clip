import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import prisma from '../../../prisma'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { url, parentId, title } = req.body

  if (!title) {
    return res.status(400).json({ message: 'title is required' })
  }

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
