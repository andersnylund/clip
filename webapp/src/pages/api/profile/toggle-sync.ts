import { NextApiRequest, NextApiResponse } from 'next'
import nc, { Middleware, RequestHandler } from 'next-connect'
import { z } from 'zod'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionNextApiRequest } from '../../../api-utils'
import prisma from '../../../prisma'

const toggleSyncSchema = z.object({
  syncEnabled: z.boolean(),
  syncId: z.string().uuid().nullable(),
})

interface ToggleSyncRequest extends SessionNextApiRequest {
  body: z.infer<typeof toggleSyncSchema>
}

// TODO: abstract this and the above function to their own methods
const validateToggleSyncMiddleware: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  const validationResult = toggleSyncSchema.safeParse(req.body)
  if (validationResult.success) {
    req.body = validationResult.data
    next()
  } else {
    throw new HttpError(validationResult.error, 400)
  }
}

const toggleSync: RequestHandler<ToggleSyncRequest, NextApiResponse> = async (req, res) => {
  const { syncEnabled, syncId } = req.body
  const user = await prisma.user.update({
    where: {
      email: req.session.user.email,
    },
    data: {
      syncEnabled,
      syncId,
    },
  })
  return res.status(200).json(user)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch })
  .use(authorizedRoute)
  .put(validateToggleSyncMiddleware, toggleSync)

export default handler
