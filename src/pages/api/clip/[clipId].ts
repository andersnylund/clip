import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { clipId } = req.query

  if (typeof clipId !== 'string') {
    return res.status(400).json({ message: 'Invalid query' })
  }

  if (req.method === 'DELETE') {
    return deleteClip(res, clipId, session)
  } else {
    return res.status(404).json({ message: 'Not found' })
  }
}

const deleteClip = async (res: NextApiResponse, clipId: string, session: Session) => {
  const clip = await prisma.clip.findOne({
    where: { id: clipId },
  })

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  })

  if (clip?.userId !== user?.id) {
    return res.status(404).json({ message: 'Clip not found' })
  }

  await prisma.clip.delete({
    where: {
      id: clip?.id,
    },
  })

  return res.status(204).end()
}

export default handler
