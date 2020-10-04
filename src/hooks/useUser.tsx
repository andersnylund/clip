import useSWR from 'swr'

import { HttpError } from '../error/http-error'
import { User } from '../types'

const APP_URL = process.env.VERCEL_URL
console.log('APP_URL', APP_URL)
console.log('process.env.VERCEL_URL', process.env.VERCEL_URL)

interface UseUser {
  user?: User
  isLoading: boolean
  error?: Error
}

export const useUser = (username?: string, initialData?: User): UseUser => {
  const { data, error } = useSWR(`/api/clips/${username}`, () => fetchUser(username), { initialData })
  return {
    user: data,
    isLoading: !error && !data,
    error,
  }
}

export const fetchUser = async (username?: string): Promise<User> => {
  console.log('fetchUser')
  const res = await fetch(`${APP_URL}/api/clips/${username ?? ''}`)
  console.log('res', res)
  if (!res.ok) {
    throw new HttpError(res.statusText, 'Getting user failed', res.status)
  }
  return res.json()
}
