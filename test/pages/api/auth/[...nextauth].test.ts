import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import route from '../../../../src/pages/api/auth/[...nextauth]'

jest.mock('next-auth', () => jest.fn())

describe('[...nextauth]', () => {
  it('handles the route', async () => {
    await route({} as NextApiRequest, ({} as unknown) as NextApiResponse)
    expect(NextAuth).toHaveBeenCalledWith(
      {},
      {},
      {
        adapter: { getAdapter: expect.anything() },
        providers: [
          {
            accessTokenUrl: 'https://github.com/login/oauth/access_token',
            authorizationUrl: 'https://github.com/login/oauth/authorize',
            clientId: undefined,
            clientSecret: undefined,
            id: 'github',
            name: 'GitHub',
            profile: expect.anything(),
            profileUrl: 'https://api.github.com/user',
            scope: 'read:user',
            type: 'oauth',
            version: '2.0',
          },
          {
            from: undefined,
            id: 'email',
            maxAge: 86400,
            name: 'Email',
            sendVerificationRequest: expect.anything(),
            server: { auth: { pass: undefined, user: undefined }, host: undefined, port: NaN },
            type: 'email',
          },
        ],
        secret: undefined,
      }
    )
  })
})
