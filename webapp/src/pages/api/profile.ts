import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import prisma from '../../prisma'

import { getChildren, mapUser } from './clips/[username]'

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req })
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  req.method === 'POST' ? await post(req, res, session) : await get(req, res, session)
}

// FIXME: fix istanbul ignores
const get = async (req: NextApiRequest, res: NextApiResponse, session: Session): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: { email: session.user.email ?? /* istanbul ignore next */ undefined },
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
    return res.status(200).json(mapUser({ ...user, clips }))
  } else {
    return res.status(404).json({ message: 'Not Found' })
  }
}

const post = async (req: NextApiRequest, res: NextApiResponse, session: Session): Promise<void> => {
  const { username } = req.body
  const user = await prisma.user.update({
    where: {
      email: session.user.email ?? /* istanbul ignore next */ undefined,
    },
    data: {
      username,
    },
  })
  res.status(200).json(user)
}

export default handler
