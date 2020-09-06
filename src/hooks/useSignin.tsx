import { useEffect } from 'react'
import { useSession } from 'next-auth/client'
import { useRouter } from 'next/router'

export const useSignin = () => {
  const [session, loading] = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session && !loading) {
      router.push('/api/auth/signin')
    }
  }, [session, loading])
}
