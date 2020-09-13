import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

import { mapUser } from './clips/[username]'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.method === 'POST' ? await post(req, res, session) : await get(req, res, session)
}

const get = async (req: NextApiRequest, res: NextApiResponse, session: Session): Promise<void> => {
  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
    include: {
      Bookmark: true,
      Folder: true,
    },
  })
  if (user) {
    return res.status(200).json(mapUser(user))
  } else {
    return res.status(400).json({ message: 'Not Found' })
  }
}

const post = async (req: NextApiRequest, res: NextApiResponse, session: Session): Promise<void> => {
  const { username } = req.body
  const user = await prisma.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      username,
    },
  })
  res.status(200).json(user)
}

export default handler
