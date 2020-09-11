import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'
import { mutate } from 'swr'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { Button, LinkButton } from '../components/buttons'
import { useProfile } from '../hooks/useProfile'

const Profile: NextPage = () => {
  const [session] = useSignin()
  const [username, setUsername] = useState('')

  const { user } = useProfile()

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
          <img src={session.user.image} alt="Profile" />
        </Left>
        <Right>
          <Label>
            <p>Username</p>
            <input placeholder="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </Label>
          <Button onClick={updateUsername}>Update</Button>
          <Description>
            <p>Your username is used to create a link to your public profile</p>
            <Link href={`/clips/${username}`}>
              <LinkButton primary>To {`/clips/${username}`}</LinkButton>
            </Link>
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

  max-width: 250px;
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
    border: 1px solid lightgray;
    &:focus {
      outline: 2px solid gray;
    }
  }
`

const Description = styled.div`
  text-align: center;
`

export default Profile
