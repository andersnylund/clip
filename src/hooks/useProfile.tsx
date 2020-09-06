import useSWR from 'swr'
import { User } from '@prisma/client'

const fetcher = async () => {
  const response: User = await (await fetch('/api/profile')).json()
  return response
}

export const useUser = () => {
  const { data, error } = useSWR('/api/profile', fetcher)
  return {
    user: data,
    isLoading: !error && !data,
    isError: error,
  }
}
