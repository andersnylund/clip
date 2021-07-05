import { NextApiRequest, NextApiResponse } from 'next'
import nc, { RequestHandler } from 'next-connect'
import { authorizedRoute, HttpError, onError, onNoMatch, SessionNextApiRequest, SimpleClip } from '../../../api-utils'
import { getChildren, RecursiveClip } from '../../../children'
import prisma from '../../../prisma'

const createClip = async (clip: SimpleClip, email?: string, parentId?: string) => {
  const parentData = {
    ...(parentId ? { connect: { id: parentId } } : {}),
  }

  const resultClip = await prisma.clip.create({
    data: {
      title: clip.title,
      url: clip.url,
      parent: parentData,
      index: clip.index,
      user: {
        connect: {
          email: email,
        },
      },
      browserIds: clip.browserIds,
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
      await createClip(clip, req.session.user.email)
    })
  )

  const allClips = await prisma.clip.findMany({
    where: {
      user: {
        email: req.session.user.email,
      },
      parentId: null,
    },
  })

  const mappedClips: RecursiveClip[] = await Promise.all(
    allClips.map(async (clip) => ({ ...clip, clips: await getChildren(clip) }))
  )

  return res.json(mappedClips)
}

const handler = nc<NextApiRequest, NextApiResponse>({ onError, onNoMatch }).use(authorizedRoute).post(post)

export default handler
