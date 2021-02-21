import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import ErrorPage from 'next/error'
import Link from 'next/link'

import { Layout } from '../../components/Layout'
import { Http } from '../../error/http-error'
import { Clips } from '../../components/Clips'
import { ProfileCard } from '../../components/ProfileCard'
import { fetchUser } from '../../hooks/useUser'
import { User } from '../../../../types'
import { useProfile } from '../../hooks/useProfile'
import { LinkButton } from '../../components/buttons'

interface ServerProps {
  user: User | null
  error: Http | null
}

const Username: NextPage<ServerProps> = ({ user, error }) => {
  const { profile } = useProfile()

  if (error) {
    return <ErrorPage statusCode={error.statusCode} />
  }

  if (!user) {
    return <ErrorPage statusCode={500} />
  }

  return (
    <Layout>
      <ProfileCard user={user} />
      <Clips clips={user.clips} />
      {profile && profile.id === user.id && (
        <Link href="/clips">
          <LinkButton primary>Edit your clips</LinkButton>
        </Link>
      )}
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
    const statusCode = e.statusCode ?? 500
    context.res.statusCode = statusCode
    error = {
      info: e.message,
      statusCode: statusCode,
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
