export const getAppUrl = (): string => {
  const appUrl = process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL
  if (!appUrl) {
    const error = 'No APP_URL or NEXT_PUBLIC_APP_URL environment variable found'
    // eslint-disable-next-line no-console
    console.error('error', error)
    throw new Error(error)
  }
  return appUrl
}
