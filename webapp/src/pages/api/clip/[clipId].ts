import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { Clip } from '@prisma/client'
import prisma from '../../../prisma'

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
  const { isOwner, clip } = await userIsOwner({ clipId, email: session.user.email })
  if (!isOwner || !clip) {
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

  const { index, parentId }: { index: number; parentId: string } = req.body

  await prisma.clip.update({
    data: {
      parent: {
        ...(parentId ? { connect: { id: parentId } } : { disconnect: true }),
      },
    },
    where: {
      id: clip.id,
    },
  })

  const allClips = (
    await prisma.clip.findMany({
      orderBy: { url: 'asc' },
      where: {
        parentId,
      },
    })
  ).filter((c) => c.id !== clipId)

  allClips.splice(index, 0, clip)

  await Promise.all(
    allClips.map(async (clip, index) => {
      await prisma.clip.update({
        data: {
          index: index,
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
  email?: string | null
  clipId: string
}): Promise<{ isOwner: boolean; clip: Clip | null }> => {
  const user = await prisma.user.findUnique({ where: { email: email ?? undefined } })

  const clip = await prisma.clip.findUnique({
    where: {
      id: clipId,
    },
  })

  const isOwner = user?.id !== undefined && clip?.userId !== undefined && user.id === clip.userId

  return {
    clip,
    isOwner,
  }
}

export default handler
