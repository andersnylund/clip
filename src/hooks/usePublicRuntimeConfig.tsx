import getConfig from 'next/config'

export const isSiteEnvDev = (): boolean => {
  return getConfig().publicRuntimeConfig.SITE_ENV === 'dev'
}
