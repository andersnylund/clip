import { useEffect } from 'react'
import { Session, useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

import { HttpError } from '../error/http-error'
import { User } from '../types'

export const useUser = (): [Session, boolean] => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session && !loading) {
      router.push('/api/auth/signin')
    }
  }, [session, loading])

  return [session, loading]
}

export const fetchUser = async (username: string): Promise<User> => {
  const res = await fetch(`http://localhost:3000/api/clips/${username}`)
  if (!res.ok) {
    const info = await res.json()
    const status = res.status
    throw new HttpError('An error occurred while fetching the data', info, status)
  }
  return res.json()
}
