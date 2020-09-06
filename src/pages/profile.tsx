import React from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { Button } from '../components/styles'

const Profile: NextPage = () => {
  const [session] = useSignin()

  return session ? (
    <Layout>
      <h1>{session.user.name}</h1>
      <p>{session.user.email}</p>
      <img src={session.user.image}></img>
      <label>
        Username
        <input />
      </label>
      <Button>Update username</Button>
    </Layout>
  ) : null
}

export default Profile
