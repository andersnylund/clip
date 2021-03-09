import { isSiteEnvDev } from '../../src/hooks/usePublicConfig'

describe('usePublicRuntineConfig', () => {
  beforeAll(() => {
    process.env.NEXT_PUBLIC_SITE_ENV = 'dev'
  })

  afterAll(() => {
    process.env.NEXT_PUBLIC_SITE_ENV = 'dev'
  })

  it('gets the SITE_ENV', () => {
    expect(isSiteEnvDev()).toEqual(true)
    process.env.NEXT_PUBLIC_SITE_ENV = 'prod'
    expect(isSiteEnvDev()).toEqual(false)
  })
})
