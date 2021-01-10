import getConfig from 'next/config'

import { isSiteEnvDev } from '../../src/hooks/usePublicRuntimeConfig'

jest.mock('next/config', () => ({
  __esModule: true,
  default: jest.fn(() => ({ publicRuntimeConfig: { SITE_ENV: 'dev' } })),
}))

describe('usePublicRuntineConfig', () => {
  it('gets the SITE_ENV', () => {
    expect(isSiteEnvDev()).toEqual(true)
    expect(getConfig).toHaveBeenCalledTimes(1)
  })
})
