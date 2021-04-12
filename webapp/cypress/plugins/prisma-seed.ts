import { addDays } from 'date-fns'
import prisma from '../../src/prisma'

export const seed = async (): Promise<null> => {
  await prisma.user.create({
    data: {
      username: 'cypress',
      name: 'Cypress Testuser',
      id: 1,
      email: 'cypress@domain.com',
    },
  })
  await prisma.session.create({
    data: {
      accessToken: 'accessToken',
      expires: addDays(new Date(), 1),
      sessionToken: 'sessionToken',
      userId: 1,
      id: 1,
    },
  })

  return null
}

export const teardown = async (): Promise<null> => {
  await prisma.clip.deleteMany()
  await prisma.session.deleteMany()
  await prisma.user.deleteMany()
  return null
}
