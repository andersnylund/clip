import prisma from '../src/prisma'

export const seed = async (): Promise<void> => {
  await prisma.user.create({
    data: {
      email: 'test.user+1@clip.so',
      username: 'testuser1',
    },
  })

  await prisma.user.create({
    data: {
      email: 'test.user+2@clip.so',
      username: 'testuser2',
    },
  })
}

export const cleanUp = async (): Promise<void> => {
  await prisma.clip.deleteMany()
  await prisma.user.deleteMany()
}
