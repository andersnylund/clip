import useSWR from 'swr'

import { HttpError } from '../error/http-error'
import { User } from '../../../types'

interface UseProfile {
  profile?: User
  isLoading: boolean
  error?: Error
}

export const PROFILE_PATH = '/api/profile'

export const useProfile = (): UseProfile => {
  const { data, error } = useSWR(PROFILE_PATH, fetchProfile)
  return {
    profile: data,
    isLoading: !error && !data,
    error,
  }
}

export const fetchProfile = async (): Promise<User> => {
  const res = await fetch(PROFILE_PATH)
  if (!res.ok) {
    throw new HttpError(res.statusText, 'Getting profile failed', res.status)
  }
  return res.json()
}
