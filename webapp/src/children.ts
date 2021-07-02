import { Clip as PrismaClip, User as PrismaUser } from '@prisma/client'
import prisma from './prisma'
import { Clip, User } from '../../shared/types'

export type PrismaUserWithClips = PrismaUser & {
  clips: RecursiveClip[]
}

export type RecursiveClip = PrismaClip & {
  clips?: RecursiveClip[]
}

export const getChildren = async (node: RecursiveClip): Promise<RecursiveClip[]> => {
  const children = await prisma.clip.findMany({
    where: {
      parentId: node.id,
    },
    orderBy: {
      index: 'asc',
    },
    include: {
      clips: {
        include: {
          clips: {
            include: {
              clips: {
                include: {
                  clips: true,
                },
              },
            },
          },
        },
      },
    },
  })

  const recursiveMap = async (clip: RecursiveClip): Promise<RecursiveClip> => {
    if (clip.clips) {
      return {
        ...clip,
        clips: await Promise.all(clip.clips.map(recursiveMap)),
      }
    } else {
      return {
        ...clip,
        clips: await getChildren(clip),
      }
    }
  }

  return await Promise.all(children.map(recursiveMap))
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
  collapsed: node.collapsed,
  id: node.id,
  index: node.index,
  parentId: node.parentId,
  title: node.title,
  url: node.url,
  userId: node.userId,
})
