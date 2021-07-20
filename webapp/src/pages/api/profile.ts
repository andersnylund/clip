import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Middleware, RequestHandler } from 'next-connect'
import { z } from 'zod'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionNextApiRequest } from '../../api-utils'
import { getChildren, mapUser } from '../../children'
import prisma from '../../prisma'

const updateProfileSchema = z.object({
  username: z.string(),
})

const validateMiddleware: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  const validationResult = updateProfileSchema.safeParse(req.body)
  if (validationResult.success) {
    req.body = validationResult.data
    next()
  } else {
    throw new HttpError(validationResult.error, 400)
  }
}

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
  if (!user) {
    throw new HttpError('Not Found', 404)
  }

  const clips = await Promise.all(user.clips.map(async (clip) => ({ ...clip, clips: await getChildren(clip) })))
  return res.status(200).json(mapUser({ ...user, clips }))
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
  .post(validateMiddleware, updateProfile)
  .delete(deleteProfile)

export default handler
