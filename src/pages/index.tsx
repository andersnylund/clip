import { NextPage } from 'next'
import { signIn, signOut, useSession } from 'next-auth/client'
import styled from 'styled-components'

const Home: NextPage = () => {
  const [session, loading] = useSession()

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <H1>
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
    </H1>
  )
}

export default Home

const H1 = styled.h1`
  font-size: 22px;
`
