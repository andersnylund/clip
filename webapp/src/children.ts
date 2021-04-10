import { Clip as PrismaClip, User as PrismaUser } from '@prisma/client'
import prisma from './prisma'
import { Clip, User } from './types'

export type PrismaUserWithClips = PrismaUser & {
  clips: RecursiveClip[]
}

type RecursiveClip = PrismaClip & {
  clips?: RecursiveClip[]
}

export const getChildren = async (node: RecursiveClip): Promise<RecursiveClip> => {
  const children = await prisma.clip.findMany({
    where: {
      parentId: node.id,
    },
    orderBy: {
      index: 'asc',
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
  clips: node.clips?.map(mapClip) || [],
  id: node.id,
  index: node.index,
  parentId: node.parentId,
  title: node.title,
  url: node.url,
  userId: node.userId,
})
