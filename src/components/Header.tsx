import React, { FC } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import styled from 'styled-components'

import { Button } from './styles'

export const Header: FC = () => {
  const [session] = useSession()

  return (
    <HeaderContainer>
      {session ? (
        <TextContainer>
          <p>
            Logged in as<Bold> {session.user.name}</Bold>
          </p>
          <Button onClick={() => signOut()}>Sign out</Button>
        </TextContainer>
      ) : (
        <Button onClick={() => signIn()}>Sign in</Button>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  justify-content: flex-end;
  display: flex;
  margin: 16px;
`

const TextContainer = styled.div`
  display: flex;
  align-items: baseline;

  > * {
    margin: 8px;
  }
`

const Bold = styled.span`
  font-weight: bold;
`
