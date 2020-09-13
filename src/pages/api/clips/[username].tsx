import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, User as PrismaUser, Folder as PrismaFolder, Bookmark as PrismaBookmark } from '@prisma/client'

import { Bookmark, Folder, User } from '../../../types/index'

const prisma = new PrismaClient()

type CompletePrismaUser = PrismaUser & {
  Bookmark: PrismaBookmark[]
  Folder: PrismaFolder[]
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username: usernameQuery } = req.query
  const username = typeof usernameQuery === 'string' ? usernameQuery : usernameQuery[0]

  const user = await prisma.user.findOne({
    where: {
      username,
    },
    include: { Bookmark: true, Folder: true },
  })

  if (user) {
    res.status(200).json(mapUser(user))
  } else {
    res.status(404).json({ message: 'Not Found' })
  }
}

export const mapUser = (user: CompletePrismaUser): User => ({
  bookmarks: user.Bookmark.map(mapBookmark),
  folders: user.Folder.map(mapFolder),
  id: user.id,
  image: user.image,
  name: user.name,
  username: user.username,
})

const mapBookmark = (bookmark: PrismaBookmark): Bookmark => ({
  id: bookmark.id,
  name: bookmark.name,
})

const mapFolder = (folder: PrismaFolder): Folder => ({
  id: folder.id,
  name: folder.name,
})

export default handler
