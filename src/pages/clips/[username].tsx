import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import ErrorPage from 'next/error'

import { Layout } from '../../components/Layout'
import { Http } from '../../error/http-error'
import { FolderList } from '../../components/FolderList'
import { ProfileCard } from '../../components/ProfileCard'
import { fetchUser } from '../../hooks/useUser'
import { User } from '../../types'

interface ServerProps {
  user: User | null
  error: Http | null
}

const Username: NextPage<ServerProps> = ({ user, error }) => {
  if (error) {
    return <ErrorPage statusCode={error.status} />
  }
  if (!user) {
    return <ErrorPage statusCode={500} />
  }

  return (
    <Layout>
      <ProfileCard user={user} />
      <FolderList folders={user.folders} />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<ServerProps> = async (context) => {
  const { username: usernameQuery } = context.query
  const username =
    typeof usernameQuery === 'string' ? usernameQuery : typeof usernameQuery === 'object' ? usernameQuery[0] : ''

  let user: User | null = null
  let error: Http | null = null

  try {
    user = await fetchUser(username)
  } catch (e) {
    context.res.statusCode = e.status ?? 500
    error = {
      info: e.message,
      status: e.status,
    }
  }

  return {
    props: {
      user,
      error,
    },
  }
}

export default Username
