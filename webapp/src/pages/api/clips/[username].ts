import { Clip as PrismaClip, User as PrismaUser } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import nc, { RequestHandler } from 'next-connect'
import { onError, onNoMatch } from '../../../api-utils'
import prisma from '../../../prisma'
import { Clip, User } from '../../../types'

export type PrismaUserWithClips = PrismaUser & {
  clips: RecursiveClip[]
}

type RecursiveClip = PrismaClip & {
  clips?: RecursiveClip[]
}

const getUser: RequestHandler<NextApiRequest, NextApiResponse> = async (req, res) => {
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

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch }).get(getUser)

export default handler
