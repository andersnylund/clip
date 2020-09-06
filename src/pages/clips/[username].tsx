import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import useSWR from 'swr'

import { Layout } from '../../components/Layout'
import { HttpError, Http } from '../../error/http-error'

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
  user: any
  error: Http | null
}

const Username: NextPage<Props> = ({ user, error }) => {
  if (error) {
    return <ErrorPage statusCode={error.status} />
  }

  return (
    <Layout>
      <h1>{user.username}'s clips</h1>
      <img src={user.image} />
      <h2>Folders</h2>
      <ul>
        {user.Folder.map((folder: any) => (
          <li key={folder.id}>{folder.name}</li>
        ))}
      </ul>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const { username: usernameQuery } = context.query
  const username =
    typeof usernameQuery === 'string' ? usernameQuery : typeof usernameQuery === 'object' ? usernameQuery[0] : ''

  let user = {}
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
