import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { folderId: folderIdQuery } = req.query
  const folderId = typeof folderIdQuery === 'string' ? folderIdQuery : folderIdQuery[0]

  const user = await userIsOwner({ email: session.user.email, folderId })

  if (!user) {
    return res.status(404).json({ message: 'Not Found' })
  }

  if (req.method === 'DELETE') {
    return deleteFolder(res, folderId)
  }
  if (req.method === 'PUT') {
    return updateFolder(req, res, folderId, user.id)
  }
  return res.status(404).end()
}

const deleteFolder = async (res: NextApiResponse, folderId: string) => {
  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  })

  res.status(204).end()
}

const updateFolder = async (req: NextApiRequest, res: NextApiResponse, folderId: string, userId: number) => {
  const { folderName, orderIndex }: { folderName?: string; orderIndex?: number } = req.body

  if (folderName) {
    await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        name: folderName,
      },
    })
  }

  const folder = await prisma.folder.findUnique({
    where: {
      id: folderId,
    },
  })

  if (orderIndex !== undefined && folder) {
    const allFolders = (
      await prisma.folder.findMany({
        where: { userId },
        orderBy: { orderIndex: 'asc' },
      })
    ).filter((folder) => folder.id !== folderId)

    allFolders.splice(orderIndex, 0, folder)

    await Promise.all(
      allFolders.map(
        async (folder, index) =>
          await prisma.folder.update({
            data: { orderIndex: index },
            where: {
              id: folder.id,
            },
          })
      )
    )
  }
  return res.status(200).json(folder)
}

const userIsOwner = async ({ email, folderId }: { email: string; folderId: string }): Promise<User | null> => {
  const user = await prisma.user.findUnique({ where: { email } })
  const folder = await prisma.folder.findUnique({ where: { id: folderId } })

  if (user !== null && folder !== null && user.id === folder.userId) {
    return user
  } else {
    return null
  }
}

export default handler
