import React, { FC } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import styled from 'styled-components'

import { Button } from '../styles'
import Link from 'next/link'

export const Header: FC = () => {
  const [session] = useSession()

  return (
    <HeaderContainer>
      <Link href="/">
        <a>clip.so</a>
      </Link>
      {session ? (
        <TextContainer>
          <p>
            Logged in as<Bold> {session.user.name}</Bold>
          </p>
          <Button onClick={() => signOut()}>Sign out</Button>
        </TextContainer>
      ) : (
        <Button primary onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  align-items: baseline;
  justify-content: space-between;
  display: flex;
  margin: 16px;

  ${Button} {
    margin: 8px;
  }

  a {
    text-decoration: none;
    color: black;
  }
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
