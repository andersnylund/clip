import useSWR from 'swr'

import { HttpError } from '../error/http-error'
import { User } from '../types'

const APP_URL = process.env.APP_URL

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
  const res = await fetch(`${APP_URL}/api/clips/${username ?? ''}`)
  if (!res.ok) {
    throw new HttpError(res.statusText, 'Getting user failed', res.status)
  }
  return res.json()
}