import useSWR from 'swr'
import { User } from '@prisma/client'
import { HttpError } from '../error/http-error'

const fetcher = async (): Promise<User> => {
  const response = await fetch('/api/profile')
  if (!response.ok) {
    throw new HttpError(response.statusText, 'Getting profile failed', response.status)
  }
  return await response.json()
}

interface UseUser {
  user?: {
    image: string | null
    name: string | null
    username: string | null
  }
  isLoading: boolean
  isError: Error
}

export const useProfile = (): UseUser => {
  const { data, error } = useSWR('/api/profile', fetcher)
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  }
}
