import { Clip } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session, User } from 'next-auth'
import { getSession } from 'next-auth/client'
import { ErrorHandler, Middleware, RequestHandler } from 'next-connect'
import prisma from './prisma'
import { v4 as uuidv4 } from 'uuid'

export type SimpleClip = Omit<Clip, 'userId'> & {
  clips: SimpleClip[]
}

export class HttpError extends Error {
  error?: string | unknown = 'Internal server error'
  status?: number = 500

  constructor(error: string | unknown, status: number) {
    super('HttpError')
    this.error = error
    this.status = status
  }
}

export type SessionPayload = {
  session: Session & {
    user: User & {
      email: string
    }
  }
}

export type SessionNextApiRequest = NextApiRequest & SessionPayload

export const authorizedRoute: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  const session = await getSession({ req })
  const email = session?.user?.email
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

export const updateSyncId: Middleware<SessionNextApiRequest, NextApiResponse> = async (req, res, next) => {
  const user = await prisma.user.findUnique({ where: { email: req.session.user.email } })
  if (user && user.syncEnabled) {
    await prisma.user.update({
      where: {
        email: req.session.user.email,
      },
      data: {
        syncId: uuidv4(),
      },
    })
  }
  next()
}

export const onError: ErrorHandler<NextApiRequest, NextApiResponse> = (err: HttpError, req, res) => {
  // TODO: fix coverage
  // TODO: enable logging somewhere somehow
  const error = err.error ?? 'Internal server error'
  const status = err.status ?? 500
  return res.status(status || 500).json({ error })
}

export const onNoMatch: RequestHandler<NextApiRequest, NextApiResponse> = (req, res) => {
  res.status(404).json({ error: 'Not found' })
}
