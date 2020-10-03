/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { InitOptions } from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import { PrismaClient } from '@prisma/client'

let prisma

/* istanbul ignore if */
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  /* istanbul ignore else */
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

const options: InitOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Providers.Email({
      server: {
        auth: {
          user: process.env.EMAIL_SERVER_USER!,
          pass: process.env.EMAIL_SERVER_PASSWORD!,
        },
        host: process.env.EMAIL_SERVER_HOST!,
        port: Number(process.env.EMAIL_SERVER_PORT!),
      },
      from: process.env.EMAIL_FROM!,
    }),
  ],
  adapter: Adapters.Prisma.Adapter({ prisma }),
  secret: process.env.NEXT_AUTH_SECRET,
}

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)

export default handler
