import { Clip } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session, User } from 'next-auth'
import { getSession } from 'next-auth/client'
import { ErrorHandler, Middleware, RequestHandler } from 'next-connect'

export type SimpleClip = Omit<Clip, 'userId'> & {
  clips: SimpleClip[]
}

export class HttpError extends Error {
  status?: number = 500

  constructor(message: string, status: number) {
    super(message)
    this.message = message
    this.status = status
  }
}

export type SessionNextApiRequest = NextApiRequest & {
  session: Session & {
    user: User & {
      email: string
    }
  }
}

export const authorizedRoute: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  const session = await getSession({ req })
  const email = session?.user.email
  if (!session || !email) {
    throw new HttpError('Unauthorized', 401)
  }
  req.session = {
    ...session,
    user: {
      ...session.user,
      email,
    },
  }

  next()
}

export const slower: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  setTimeout(() => next(), 3000)
}

export const onError: ErrorHandler<NextApiRequest, NextApiResponse> = (err: HttpError, req, res) => {
  // TODO: fix coverage
  // TODO: fix that prisma errors are shown to user in message
  return res.status(err.status || 500).json({ message: err.message })
}

export const onNoMatch: RequestHandler<NextApiRequest, NextApiResponse> = (req, res) => {
  res.status(404).json({ message: 'Not found' })
}
