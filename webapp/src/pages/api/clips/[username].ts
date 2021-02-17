import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { User as PrismaUser, Clip as PrismaClip } from '@prisma/client'

import { Clip, User } from '../../../types/index'
import prisma from '../../../prisma'

export type PrismaUserWithClips = PrismaUser & {
  clips: RecursiveClip[]
}

type RecursiveClip = PrismaClip & {
  clips?: RecursiveClip[]
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username: usernameQuery } = req.query
  const username = typeof usernameQuery === 'string' ? usernameQuery : usernameQuery[0]

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      clips: {
        where: {
          parentId: null,
        },
        orderBy: {
          url: 'asc',
        },
      },
    },
  })

  if (user) {
    const clips = await Promise.all(user.clips.map((clip) => getChildren(clip)))
    return res.json(mapUser({ ...user, clips }))
  } else {
    return res.status(404).json({ message: 'Not Found' })
  }
}

export const getChildren = async (node: RecursiveClip): Promise<RecursiveClip> => {
  const children = await prisma.clip.findMany({
    where: {
      parentId: node.id,
    },
    orderBy: {
      url: 'asc',
    },
  })
  return {
    ...node,
    clips: await Promise.all(children.map((child) => getChildren(child))),
  }
}

export const mapUser = (user: PrismaUserWithClips): User => ({
  clips: user.clips.map(mapClip),
  id: user.id,
  image: user.image,
  name: user.name,
  username: user.username,
})

export const mapClip = (node: RecursiveClip): Clip => ({
  clips: node.clips?.map(mapClip) || /* istanbul ignore next */ [],
  id: node.id,
  index: node.index,
  parentId: node.parentId,
  title: node.title,
  url: node.url,
  userId: node.userId,
})

export default handler
