import React, { useEffect, useState } from 'react'
import { NextPage, GetServerSideProps } from 'next'
import ErrorPage from 'next/error'
import { useSession } from 'next-auth/client'

import { Layout } from '../../components/Layout'
import { HttpError, Http } from '../../error/http-error'
import { useProfile } from '../../hooks/useProfile'
import { AddFolder } from '../../components/AddFolder'
import { FolderList } from '../../components/FolderList'
import { ProfileCard } from '../../components/ProfileCard'

const fetchUser = async (username: string) => {
  const res = await fetch(`http://localhost:3000/api/clips/${username}`)
  if (!res.ok) {
    const info = await res.json()
    const status = res.status
    throw new HttpError('An error occurred while fetching the data', info, status)
  }
  return await res.json()
}

interface Props {
  user: { username: string; name: string; image: string; Folder: { id: string; name: string }[] } | null
  error: Http | null
}

const Username: NextPage<Props> = ({ user, error }) => {
  const [session] = useSession()
  const { user: profile } = useProfile()
  const [isOwnPage, setIsOwnPage] = useState(false)

  useEffect(() => {
    if (session) {
      if (profile?.username === user?.username) {
        setIsOwnPage(true)
      }
    }
  }, [session, profile])

  if (error) {
    return <ErrorPage statusCode={error.status} />
  }
  if (!user) {
    return <ErrorPage statusCode={500} />
  }

  return (
    <Layout>
      <ProfileCard user={user} />
      <FolderList folders={user.Folder} />
      {isOwnPage && <AddFolder />}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { username: usernameQuery } = context.query
  const username =
    typeof usernameQuery === 'string' ? usernameQuery : typeof usernameQuery === 'object' ? usernameQuery[0] : ''

  let user = null
  let error: Http | null = null

  try {
    user = await fetchUser(username)
  } catch (e) {
    context.res.statusCode = e.status
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
