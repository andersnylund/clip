import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Middleware, RequestHandler } from 'next-connect'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionNextApiRequest } from '../../../api-utils'
import prisma from '../../../prisma'

interface ClipIdRequest extends SessionNextApiRequest {
  clipId: string
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

const deleteClip: RequestHandler<ClipIdRequest, NextApiResponse> = async (req, res) => {
  await prisma.clip.delete({
    where: {
      id: req.clipId,
    },
  })
  return res.status(204).end()
}

const updateClip: RequestHandler<ClipIdRequest, NextApiResponse> = async (req, res) => {
  const { parentId, title }: { parentId?: string; title?: string } = req.body
  const clip = await prisma.clip.findUnique({ where: { id: req.clipId } })
  const parentData = {
    ...(parentId ? { connect: { id: parentId } } : clip?.parentId ? { disconnect: true } : {}),
  }
  const result = await prisma.clip.update({
    data: {
      parent: parentData,
      title,
    },
    where: {
      id: req.clipId,
    },
  })
  return res.status(200).json(result)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .use(clipIdMiddleware)
  .put(updateClip)
  .delete(deleteClip)

export default handler
