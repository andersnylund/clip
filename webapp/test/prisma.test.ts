import { PrismaClient } from '@prisma/client'

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(),
}))

describe('prisma', () => {
  let prisma: unknown

  beforeEach(async () => {
    global.prisma = undefined
    const module = await import('../src/prisma')
    prisma = module
    jest.resetModules()
  })

  it('handles situation where NODE_ENV is production', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = 'production'
    await import('../src/prisma')
    expect(prisma).toEqual({
      default: expect.anything(),
    })
    expect(PrismaClient).toHaveBeenCalled()
    expect(global.prisma).toEqual({})
  })

  it('handles situation where NODE_ENV is development', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    await import('../src/prisma')
    expect(prisma).toEqual({
      default: expect.anything(),
    })
    expect(PrismaClient).toHaveBeenCalled()
    expect(global.prisma).toEqual({})
  })

  it('handles situation where NODE_ENV is development and global prisma is already found', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    global.prisma = {}
    await import('../src/prisma')
    expect(prisma).toEqual({
      default: expect.anything(),
    })
    expect(PrismaClient).toHaveBeenCalled()
    expect(global.prisma).toEqual({})
  })
})
