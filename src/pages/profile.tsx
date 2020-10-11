import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'
import { mutate } from 'swr'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { Button, LinkButton } from '../components/buttons'
import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { Input, Label } from '../text-styles'
import { AddFolder } from '../components/AddFolder'
import { ProfileFolderList } from '../components/ProfileFolderList'

const Profile: NextPage = () => {
  const [session] = useSignin()
  const [username, setUsername] = useState('')

  const { profile } = useProfile()

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
    }
  }, [profile])

  const updateUsername = async () => {
    await fetch(PROFILE_PATH, {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
      await mutate(PROFILE_PATH)
  }

  return session ? (
    <Layout>
      <Container>
        <Left>
          <h1>{session.user.name}</h1>
          <p>{session.user.email}</p>
          <p>{profile?.username}</p>
          <img src={session.user.image} alt="Profile" />
        </Left>
        <Right>
          <Label>
            <p>Username</p>
            <Input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Label>
          <Button onClick={updateUsername}>Update</Button>
          <Description>
            <p>Your username is used to create a link to your public profile</p>
            <Link href={'/clips/[username]'} as={`/clips/${username}`}>
              <LinkButton primary>To {`/clips/${username}`}</LinkButton>
            </Link>
          </Description>
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
