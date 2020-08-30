import React, { FC } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import styled from 'styled-components'

export const Header: FC = () => {
  const [session] = useSession()

  return (
    <Container>
      {session ? (
        <div>
          <p>Logged in as {session.user.name}</p>
          <button onClick={signOut}>Sign out</button>
        </div>
      ) : (
        <button onClick={signIn}>Sign in</button>
      )}
    </Container>
  )
}

const Container = styled.header`
  justify-content: flex-end;
  display: flex;
  margin: 16px;
`
