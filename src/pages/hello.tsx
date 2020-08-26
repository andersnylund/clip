import React from 'react'
import { useSession } from 'next-auth/client'

export const Hello = () => {
  const [session, loading] = useSession()

  return <div>{JSON.stringify(session, null, 2)}</div>
}

export default Hello
