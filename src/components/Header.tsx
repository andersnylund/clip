import React, { FC } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import styled from 'styled-components'
import NextLink from 'next/link'

import { Button } from './buttons'

export const Header: FC = () => {
  const [session] = useSession()

  return (
    <HeaderContainer>
      <Link href="/">
        <LinkContainer>
          <Clip src="/clip.svg" />
          <span>clip.so</span>
        </LinkContainer>
      </Link>
      {session ? (
        <TextContainer>
          <Link href="/profile">
            <a>
              Logged in as <Bold>{session.user.name}</Bold>
            </a>
          </Link>
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

const LinkContainer = styled.a`
  align-items: center;
  cursor: pointer;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  justify-content: center;
  span {
    color: gray;
  }
`

const Clip = styled.img`
  height: 24px;
`

const Link = styled(NextLink)`
  cursor: pointer;
`

const Bold = styled.span`
  font-weight: bold;
`
