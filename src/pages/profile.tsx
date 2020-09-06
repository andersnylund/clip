import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'
import { mutate } from 'swr'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { Button, HugeH1 } from '../styles'
import { useUser } from '../hooks/useProfile'

const Profile: NextPage = () => {
  const [session] = useSignin()
  const [username, setUsername] = useState('')

  const { user } = useUser()

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '')
    }
  }, [user])

  const updateUsername = async () => {
    await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
      mutate('/api/profile')
  }

  return session ? (
    <Layout>
      <Container>
        <Left>
          <h1>{session.user.name}</h1>
          <p>{session.user.email}</p>
          <img src={session.user.image} alt="Profile picture" />
        </Left>
        <Right>
          <Label>
            <p>Username</p>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Label>
          <Button primary onClick={updateUsername}>
            Update
          </Button>
          <Description>
            Your username is used to create your public profile. Navigate to{' '}
            <Link href={`/clips/${username}`}>{`/clips/${username}`}</Link> to see your own profile
          </Description>
        </Right>
      </Container>
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

  max-width: 300px;
`

const Label = styled.label`
  color: grey;

  p {
    margin: 4px 0;
  }

  input {
    border-radius: 4px;
    padding: 4px;
    font-size: 18px;
    font-weight: 600;
  }
`

const Description = styled.p`
  a {
    color: brown;
    text-decoration: none;
  }
`

export default Profile
