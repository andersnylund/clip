import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Middleware, RequestHandler } from 'next-connect'
import { z } from 'zod'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionNextApiRequest, SimpleClip } from '../../../api-utils'
import { getChildren, RecursiveClip } from '../../../children'
import prisma from '../../../prisma'

const importPayloadSchema = z.array(
  z.object({
    clips: z.array(z.any()),
    collapsed: z.boolean(),
    id: z.string(),
    index: z.number().nullable(),
    parentId: z.string().nullable(),
    title: z.string(),
    url: z.string().url().nullable(),
  })
)

interface BodyPayloadRequest extends SessionNextApiRequest {
  body: z.infer<typeof importPayloadSchema>
}

const createClip = async (clip: SimpleClip, email?: string, parentId?: string) => {
  const parentData = {
    ...(parentId ? { connect: { id: parentId } } : {}),
  }

  const resultClip = await prisma.clip.create({
    data: {
      title: clip.title,
      url: clip.url,
      parent: parentData,
      index: clip.index,
      user: {
        connect: {
          email: email,
        },
      },
    },
  })
  await Promise.all(clip.clips.map((c) => createClip(c, email, resultClip.id)))
}

const validateClips = (data: unknown) => {
  const clips = importPayloadSchema.parse(data)
  clips.map((clip) => validateClips(clip.clips))
  return clips
}

export const validationMiddleware: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  try {
    const result = validateClips(req.body)
    req.body = result
    next()
  } catch (e) {
    throw new HttpError(e, 400)
  }
}

const post: RequestHandler<BodyPayloadRequest, NextApiResponse> = async (req, res) => {
  const clips = req.body

  await prisma.clip.deleteMany({
    where: {
      user: {
        email: req.session.user.email,
      },
    },
  })

  await Promise.all(
    clips.map(async (clip) => {
      await createClip(clip, req.session.user.email)
    })
  )

  const allClips = await prisma.clip.findMany({
    where: {
      user: {
        email: req.session.user.email,
      },
      parentId: null,
    },
  })

  const mappedClips: RecursiveClip[] = await Promise.all(
    allClips.map(async (clip) => ({ ...clip, clips: await getChildren(clip) }))
  )

  return res.json(mappedClips)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .use(validationMiddleware)
  .post(post)

export default handler
