import useSWR from 'swr'
import { User } from '@prisma/client'
import { HttpError } from '../error/http-error'

interface UseProfile {
  profile?: {
    image: string | null
    name: string | null
    username: string | null
  }
  isLoading: boolean
  isError: Error
}

export const useProfile = (): UseProfile => {
  const { data, error } = useSWR('/api/profile', fetchProfile)
  return {
    profile: data,
    isLoading: !error && !data,
    isError: error,
  }
}

const fetchProfile = async (): Promise<User> => {
  const response = await fetch('/api/profile')
  if (!response.ok) {
    throw new HttpError(response.statusText, 'Getting profile failed', response.status)
  }
  return await response.json()
}
