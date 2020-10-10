import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  if (req.method === 'DELETE') {
    return deleteFolder(req, res, session)
  }
}

const deleteFolder = async (req: NextApiRequest, res: NextApiResponse, session: Session) => {
  const { folderId: folderIdQuery } = req.query
  const folderId = typeof folderIdQuery === 'string' ? folderIdQuery : folderIdQuery[0]

  const user = await prisma.user.findOne({
    where: {
      email: session.user.email,
    },
  })

  const folder = await prisma.folder.findOne({
    where: {
      id: folderId,
    },
  })

  if (!user?.id || user.id !== folder?.userId) {
    return res.status(404).json({ message: 'Not Found' })
  }

  await prisma.folder.delete({
    where: {
      id: folderId,
    },
  })

  res.status(204).end()
}

export default handler
