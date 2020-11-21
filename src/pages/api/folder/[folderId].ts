import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session || !session.user.email) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const { folderId: folderIdQuery } = req.query
  const folderId = typeof folderIdQuery === 'string' ? folderIdQuery : folderIdQuery[0]

  const isOwner = await userIsOwner({ email: session.user.email, folderId })

  if (!isOwner) {
    return res.status(404).json({ message: 'Not Found' })
  }

  if (req.method === 'DELETE') {
    return deleteFolder(res, folderId)
  }
  if (req.method === 'PUT') {
    return updateFolder(req, res, folderId)
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

const updateFolder = async (req: NextApiRequest, res: NextApiResponse, folderId: string) => {
  const { folderName } = req.body

  if (!folderName) {
    return res.status(400).json({ message: 'Folder name required' })
  }

  const updatedFolder = await prisma.folder.update({
    where: {
      id: folderId,
    },
    data: {
      name: folderName,
    },
  })

  res.status(200).json(updatedFolder)
}

const userIsOwner = async ({ email, folderId }: { email: string; folderId: string }): Promise<boolean> => {
  const user = await prisma.user.findOne({ where: { email } })
  const folder = await prisma.folder.findOne({ where: { id: folderId } })

  return Boolean(user?.id && user.id === folder?.userId)
}

export default handler
