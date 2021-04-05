/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Adapters from 'next-auth/adapters'
import Providers from 'next-auth/providers'
import prisma from '../../../prisma'

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      scope: 'read:user',
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
  secret: process.env.NEXTAUTH_SECRET,
}

const handler: NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, options)

export default handler
