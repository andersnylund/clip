import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { Clip, PrismaClient } from '@prisma/client'
import { splitAt } from 'remeda'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
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
  } else if (req.method === 'PUT') {
    return updateClip(req, res, clipId, session)
  } else {
    return res.status(404).json({ message: 'Not found' })
  }
}

const deleteClip = async (res: NextApiResponse, clipId: string, session: Session) => {
  // TODO: use userIsOwner helper
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

const updateClip = async (req: NextApiRequest, res: NextApiResponse, clipId: string, session: Session) => {
  const { isOwner, clip } = await userIsOwner({ clipId, email: session.user.email })
  if (!isOwner || !clip) {
    return res.status(404).json({ message: 'Clip not found' })
  }

  const { orderIndex } = req.body

  const allClips = (
    await prisma.clip.findMany({
      orderBy: { orderIndex: 'asc' },
      where: {
        folderId: clip.folderId,
      },
    })
  ).filter((c) => c.id !== clipId)

  allClips.splice(orderIndex, 0, clip)

  await Promise.all(
    allClips.map(async (clip, index) => {
      await prisma.clip.update({
        data: {
          orderIndex: index,
        },
        where: {
          id: clip.id,
        },
      })
    })
  )

  return res.status(200).json(clip)
}

const userIsOwner = async ({
  email,
  clipId,
}: {
  email: string
  clipId: string
}): Promise<{ isOwner: boolean; clip: Clip | null }> => {
  const user = await prisma.user.findOne({ where: { email } })
  const clip = await prisma.clip.findOne({ where: { id: clipId } })
  const isOwner = Boolean(user?.id && user.id === clip?.userId)

  return {
    clip,
    isOwner,
  }
}

export default handler
