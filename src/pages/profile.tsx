import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import useSWR, { mutate } from 'swr'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { Button } from '../components/styles'
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
      <h1>{session.user.name}</h1>
      <p>{session.user.email}</p>
      <img src={session.user.image}></img>
      <label>
        Username
        <input value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <Button onClick={updateUsername}>Update username</Button>
    </Layout>
  ) : null
}

export default Profile
