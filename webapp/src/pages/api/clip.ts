import { NextApiRequest, NextApiResponse } from 'next'
import nc, { RequestHandler } from 'next-connect'
import { authorizedRoute, onError, onNoMatch, SessionNextApiRequest, slower } from '../../api-utils'
import prisma from '../../prisma'

const createClip: RequestHandler<SessionNextApiRequest, NextApiResponse> = async (req, res) => {
  const { url, parentId, title } = req.body

  if (!title) {
    return res.status(400).json({ message: 'title is required' })
  }

  if (url === '') {
    return res.status(400).json({ message: "url can't be an empty string" })
  }

  const clip = await prisma.clip.create({
    data: {
      title,
      url,
      parent: parentId
        ? {
            connect: {
              id: parentId,
            },
          }
        : undefined,
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
  .use(slower)
  .use(authorizedRoute)
  .post(createClip)

export default handler
