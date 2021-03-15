export const isSiteEnvDev = (): boolean => {
  return process.env.NEXT_PUBLIC_SITE_ENV === 'dev'
}
