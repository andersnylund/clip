import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, Session } from 'next-auth/client'
import nc, { ErrorHandler, Middleware, RequestHandler } from 'next-connect'
import prisma from '../../../prisma'
import { Clip } from '../../../types'
import { mapClip } from './[username]'

export type SimpleClip = Omit<Clip, 'userId'> & {
  clips: SimpleClip[]
}

class HttpError extends Error {
  status?: number = 500

  constructor(message: string, status: number) {
    super(message)
    this.message = message
    this.status = status
  }
}

type SessionNextApiRequest = NextApiRequest & {
  session: Session
}

const authorizedRoute: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  const session = await getSession({ req })
  if (!session) {
    throw new HttpError('Unauthorized', 401)
  }
  req.session = session
  next()
}

const onError: ErrorHandler<NextApiRequest, NextApiResponse> = (err: HttpError, req, res) =>
  res.status(err.status || 500).json({ message: err.message })

const createClip = async (clip: SimpleClip, email?: string, parentId?: string) => {
  const parentData = {
    ...(parentId ? { connect: { id: parentId } } : {}),
  }

  const resultClip = await prisma.clip.create({
    data: {
      title: clip.title,
      url: clip.url,
      parent: parentData,
      user: {
        connect: {
          email,
        },
      },
    },
  })
  await Promise.all(clip.clips.map((c) => createClip(c, email, resultClip.id)))
}

const post: RequestHandler<SessionNextApiRequest, NextApiResponse> = async (req, res) => {
  const clips: SimpleClip[] = req.body.clips

  if (!clips) {
    throw new HttpError('clips are required in the body', 400)
  }

  await prisma.clip.deleteMany({
    where: {
      user: {
        email: req.session.user.email,
      },
    },
  })

  await Promise.all(
    clips.map(async (clip) => {
      await createClip(clip, req.session.user.email || undefined)
    })
  )

  const allClips = await prisma.clip.findMany({
    where: {
      user: {
        email: req.session.user.email,
      },
    },
  })

  const mappedClips = allClips.map(mapClip)

  return res.json(mappedClips)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError })
  .use(authorizedRoute)
  .post(post)

export default handler
