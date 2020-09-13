import useSWR from 'swr'

import { HttpError } from '../error/http-error'
import { User } from '../types'

interface UseUser {
  user?: User
  isLoading: boolean
  isError: Error
}

export const useUser = (username?: string, initialData?: User): UseUser => {
  const { data, error } = useSWR(`/api/clips/${username}`, () => fetchUser(username), { initialData })
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  }
}

export const fetchUser = async (username?: string): Promise<User> => {
  const res = await fetch(`http://localhost:3000/api/clips/${username ?? ''}`)
  if (!res.ok) {
    const info = await res.json()
    const status = res.status
    throw new HttpError('An error occurred while fetching the data', info, status)
  }
  return res.json()
}
