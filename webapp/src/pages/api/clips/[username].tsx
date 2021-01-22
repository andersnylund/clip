import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, User as PrismaUser, Node as PrismaNode } from '@prisma/client'

import { Node, User } from '../../../types/index'

const prisma = new PrismaClient()

type PrismaUserWithNodes = PrismaUser & {
  nodes: RecursiveNode[]
}

type RecursiveNode = PrismaNode & {
  children?: RecursiveNode[]
}

const handler: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { username: usernameQuery } = req.query
  const username = typeof usernameQuery === 'string' ? usernameQuery : usernameQuery[0]

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
    include: {
      nodes: {
        where: {
          parentId: null,
        },
        orderBy: {
          index: 'asc',
        },
      },
    },
  })

  if (user) {
    const nodes = await Promise.all(user.nodes.map((node) => getChildren(node)))
    return res.json(mapUser({ ...user, nodes }))
  } else {
    return res.status(404).json({ message: 'Not Found' })
  }
}

const getChildren = async (node: RecursiveNode): Promise<RecursiveNode> => {
  const children = await prisma.node.findMany({
    where: {
      parentId: node.id,
    },
    orderBy: {
      index: 'asc',
    },
  })
  if (children) {
    return {
      ...node,
      children: await Promise.all(children.map((child) => getChildren(child))),
    }
  } else {
    return node
  }
}

export const mapUser = (user: PrismaUserWithNodes): User => ({
  nodes: user.nodes.map(mapNode),
  id: user.id,
  image: user.image,
  name: user.name,
  username: user.username,
})

const mapNode = (node: RecursiveNode): Node => ({
  id: node.id,
  index: node.index,
  title: node.title,
  url: node.url,
  children: node.children?.map(mapNode),
})

export default handler
