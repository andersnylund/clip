import { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/client'

const Home: NextPage = () => {
  const [session, loading] = useSession()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={signIn}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={signOut}>Sign out</button>
        </>
      )}
    </>
  )
}

export default Home
