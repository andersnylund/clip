import React from 'react'
import { NextPage } from 'next'
import Link from 'next/link'

import { Layout } from '../../components/Layout'
import { useProfile } from '../../hooks/useProfile'
import { ProfileFolderList } from '../../components/ProfileFolderList'
import { AddFolder } from '../../components/AddFolder'
import { isSiteEnvDev } from '../../hooks/usePublicRuntimeConfig'
import { Button, LinkButton } from '../../components/buttons'

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
          {isDev && (
            <Button
              onClick={() => {
                window.postMessage({ type: 'IMPORT_BOOKMARKS' }, window.location.toString())
              }}
            >
              Import bookmarks from chrome
            </Button>
          )}
        </>
      )}
    </Layout>
  )
}

export default Clips
