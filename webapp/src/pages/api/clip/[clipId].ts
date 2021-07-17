import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Middleware, RequestHandler } from 'next-connect'
import { z } from 'zod'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionNextApiRequest } from '../../../api-utils'
import prisma from '../../../prisma'

interface ClipIdRequest extends SessionNextApiRequest {
  clipId: string
}

const clipUpdateSchema = z
  .object({
    parentId: z.string().optional().nullable(),
    title: z.string().optional(),
    url: z.string().optional(),
    index: z.number().optional(),
    collapsed: z.boolean().optional(),
  })
  .strict()

interface RequestWithBody extends ClipIdRequest {
  body: z.infer<typeof clipUpdateSchema>
}

export const clipIdMiddleware: Middleware<ClipIdRequest, NextApiResponse> = async (req, res, next) => {
  const { clipId } = req.query
  if (typeof clipId !== 'string') {
    throw new HttpError('Invalid query', 400)
  }
  req.clipId = clipId
  const user = await prisma.user.findUnique({ where: { email: req.session.user.email } })
  const clip = await prisma.clip.findUnique({
    where: {
      id: clipId,
    },
  })
  const isOwner = user?.id !== undefined && clip?.userId !== undefined && user.id === clip.userId
  if (!isOwner) {
    throw new HttpError('Clip not found', 404)
  }
  next()
}

export const validatePutPayload: Middleware<ClipIdRequest, NextApiResponse> = async (req, res, next) => {
  try {
    const validationResult = clipUpdateSchema.parse(req.body)
    req.body = validationResult
    next()
  } catch (e) {
    throw new HttpError(e, 400)
  }
}

const deleteClip: RequestHandler<ClipIdRequest, NextApiResponse> = async (req, res) => {
  const recursiveDelete = async (clipId: string) => {
    const clip = await prisma.clip.findUnique({ where: { id: clipId }, include: { clips: true } })

    await prisma.clip.delete({
      where: {
        id: clip?.id,
      },
    })

    if (clip?.clips) {
      await Promise.all(clip.clips.map(async (c) => await recursiveDelete(c.id)))
    }
  }

  await recursiveDelete(req.clipId)

  return res.status(204).end()
}

const updateClip: RequestHandler<RequestWithBody, NextApiResponse> = async (req, res) => {
  const { parentId, title, url, index, collapsed } = req.body

  const parentData: { connect?: { id: string }; disconnect?: boolean } = {
    ...(parentId ? { connect: { id: parentId } } : parentId === null ? { disconnect: true } : {}),
  }

  const result = await prisma.clip.update({
    data: {
      parent: parentData,
      title,
      url,
      index,
      collapsed,
    },
    where: {
      id: req.clipId,
    },
  })

  if (index !== undefined) {
    const allClips = await prisma.clip.findMany({
      orderBy: { index: 'asc' },
      where: {
        parentId: result.parentId,
        userId: result.userId,
        NOT: {
          id: req.clipId,
        },
      },
    })

    if (allClips.length > 0) {
      allClips.splice(index, 0, result)

      await Promise.all(
        allClips.map(async (clip, index) => {
          await prisma.clip.update({
            data: {
              index,
            },
            where: {
              id: clip.id,
            },
          })
        })
      )
    }
  }

  return res.status(200).json(result)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .use(clipIdMiddleware)
  .put(validatePutPayload, updateClip)
  .delete(deleteClip)

export default handler
