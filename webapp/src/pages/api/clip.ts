import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Middleware, RequestHandler } from 'next-connect'
import { z } from 'zod'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionPayload, updateSyncId } from '../../api-utils'
import prisma from '../../prisma'

const clipSchema = z.object({
  title: z.string(),
  url: z.string().url().nullable(),
})

type ValidatedRequest = Omit<NextApiRequest, 'body'> &
  SessionPayload & {
    body: z.infer<typeof clipSchema>
  }

const validateClip: Middleware<NextApiRequest, NextApiResponse> = async (req, res, next) => {
  const validationResult = clipSchema.safeParse(req.body)
  if (validationResult.success) {
    req.body = validationResult.data
    next()
  } else {
    throw new HttpError(validationResult.error.errors, 400)
  }
}

const createClip: RequestHandler<ValidatedRequest, NextApiResponse> = async (req, res) => {
  const clip = await prisma.clip.create({
    data: {
      title: req.body.title,
      url: req.body.url,
      user: {
        connect: {
          email: req.session.user.email,
        },
      },
    },
  })

  return res.status(201).json(clip)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .use(validateClip)
  .use(updateSyncId)
  .post(createClip)

export default handler
