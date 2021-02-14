import prisma from '../src/prisma'

export const seed = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      email: 'test.user+1@clip.so',
    },
  })

  await prisma.user.create({
    data: {
      email: 'test.user+2@clip.so',
    },
  })
}
