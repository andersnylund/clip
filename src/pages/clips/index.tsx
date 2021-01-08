import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

import { Layout } from '../../components/Layout'
import { useProfile } from '../../hooks/useProfile'
import { ProfileFolderList } from '../../components/ProfileFolderList'
import { AddFolder } from '../../components/AddFolder'
import { LinkButton } from '../../components/buttons'
import { isSiteEnvDev } from '../../hooks/usePublicRuntimeConfig'

const Clips: NextPage = () => {
  const { profile, isLoading } = useProfile()
  const isDev = isSiteEnvDev()

  return (
    <Layout>
      {profile && !isLoading && (
        <>
          <ProfileFolderList />
          <AddFolder />
          <Link href={`/clips/${profile.username}`}>
            <LinkButton>Your public profile</LinkButton>
          </Link>
          {isDev && <p>This should be hidden in production</p>}
        </>
      )}
    </Layout>
  )
}

export default Clips
