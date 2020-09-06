import React from 'react'
import { NextPage } from 'next'
import { useSession } from 'next-auth/client'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { Button } from '../components/styles'

const Profile: NextPage = () => {
  useSignin()
  const [session] = useSession()

  return (
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
  )
}

export default Profile
