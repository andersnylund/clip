import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, User as PrismaUser, Folder as PrismaFolder, Clip as PrismaClip } from '@prisma/client'

import { Clip, Folder, User } from '../../../types/index'

const prisma = new PrismaClient()

type CompletePrismaUser = PrismaUser & {
  clips: PrismaClip[]
  folders: (PrismaFolder & {
    clips: PrismaClip[]
  })[]
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username: usernameQuery } = req.query
  const username = typeof usernameQuery === 'string' ? usernameQuery : usernameQuery[0]

  const user = await prisma.user.findOne({
    where: {
      username,
    },
    include: {
      clips: true,
      folders: {
        include: {
          clips: true,
        },
      },
    },
  })

  if (user) {
    res.status(200).json(mapUser(user))
  } else {
    res.status(404).json({ message: 'Not Found' })
  }
}

export const mapUser = (user: CompletePrismaUser): User => ({
  clips: user.clips.map(mapClip),
  folders: user.folders.map(mapFolder),
  id: user.id,
  image: user.image,
  name: user.name,
  username: user.username,
})

const mapClip = (clip: PrismaClip): Clip => ({
  id: clip.id,
  name: clip.name,
  folderId: clip.folderId,
  url: clip.url,
  userId: clip.userId,
  orderIndex: clip.orderIndex,
})

const mapFolder = (folder: PrismaFolder & { clips: PrismaClip[] }): Folder => ({
  id: folder.id,
  name: folder.name,
  clips: folder.clips,
})

export default handler
