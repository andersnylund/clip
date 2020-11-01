import React from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { LinkButton } from '../components/buttons'
import { useProfile } from '../hooks/useProfile'
import { AddFolder } from '../components/AddFolder'
import { ProfileFolderList } from '../components/ProfileFolderList'
import { UsernameModal } from '../components/UsernameModal'
import { UsernamePrompt } from '../components/UsernamePrompt'

const Profile: NextPage = () => {
  const [session] = useSignin()
  const { profile } = useProfile()

  return session ? (
    <Layout>
      {profile && !profile?.username && <UsernameModal />}
      <Container>
        <Left>
          <h1>{session.user.name}</h1>
          <p>{session.user.email}</p>
          <p>{profile?.username}</p>
          <img src={session.user.image} alt="Profile" />
        </Left>
        <Right>
          <UsernamePrompt />
          {profile?.username && (
            <Description>
              <p>Your username is used to create a link to your public profile</p>
              <Link href={'/clips/[username]'} as={`/clips/${profile.username}`}>
                <LinkButton primary>To {`/clips/${profile.username}`}</LinkButton>
              </Link>
            </Description>
          )}
        </Right>
      </Container>
      {profile && <ProfileFolderList />}
      <AddFolder />
    </Layout>
  ) : null
}

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const Left = styled.div`
  text-align: center;

  img {
    border-radius: 50%;
    width: 80%;
  }

  > * {
    margin: 16px;
  }
`

const Right = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;

  > * {
    margin: 8px 0;
  }

  max-width: 250px;
`

const Description = styled.div`
  text-align: center;
`

export default Profile
