import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async (req: NextApiRequest, res: NextApiResponse) => {
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
  })
  res.status(200).json(user)
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
