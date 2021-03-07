import React, { FC } from 'react'
import { useSession, signIn, signOut } from 'next-auth/client'
import styled from 'styled-components'
import NextLink from 'next/link'

import { Button } from './buttons'
import { useProfile } from '../hooks/useProfile'

export const Header: FC = () => {
  const [session] = useSession()
  const { profile } = useProfile()

  return (
    <HeaderContainer>
      <Link href="/">
        <LinkContainer>
          <Clip src="/clip.svg" alt="Clip" />
          <span>clip.so</span>
        </LinkContainer>
      </Link>
      {session ? (
        <TextContainer>
          <Link href="/profile">
            <a>
              Logged in as <Bold>{profile?.username}</Bold>
            </a>
          </Link>
          <Button onClick={() => signOut()}>Sign out</Button>
        </TextContainer>
      ) : (
        <Button color="primary" onClick={() => signIn()}>
          Sign in
        </Button>
      )}
    </HeaderContainer>
  )
}

const HeaderContainer = styled.header`
  align-items: center;
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
  align-items: center;
  text-align: center;

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
  margin-right: 8px;
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
