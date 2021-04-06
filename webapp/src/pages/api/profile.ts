import { NextApiRequest, NextApiResponse } from 'next'
import nc, { RequestHandler } from 'next-connect'
import { authorizedRoute, onError, onNoMatch, SessionNextApiRequest } from '../../api-utils'
import { getChildren, mapUser } from '../../children'
import prisma from '../../prisma'

const getProfile: RequestHandler<SessionNextApiRequest, NextApiResponse> = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { email: req.session.user.email },
    include: {
      clips: {
        where: {
          parentId: null,
        },
        orderBy: {
          index: 'asc',
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

const updateProfile: RequestHandler<SessionNextApiRequest, NextApiResponse> = async (req, res) => {
  const { username } = req.body
  const user = await prisma.user.update({
    where: {
      email: req.session.user.email,
    },
    data: {
      username,
    },
  })
  res.status(200).json(user)
}

const deleteProfile: RequestHandler<SessionNextApiRequest, NextApiResponse> = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: {
      email: req.session.user.email,
    },
  })

  if (user) {
    await prisma.account.deleteMany({
      where: {
        userId: user.id,
      },
    })
    await prisma.session.deleteMany({
      where: {
        userId: user.id,
      },
    })
    await prisma.clip.deleteMany({
      where: {
        user: {
          email: req.session.user.email,
        },
      },
    })
    await prisma.user.delete({
      where: {
        id: user.id,
      },
    })
    return res.status(204).end()
  }
  return res.status(500).end()
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .get(getProfile)
  .post(updateProfile)
  .delete(deleteProfile)

export default handler
