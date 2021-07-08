import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useSignin = (): ReturnType<typeof useSession> => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session && !loading) {
      router.push('/api/auth/signin')
    }
  }, [router, session, loading])

  return [session, loading]
}
