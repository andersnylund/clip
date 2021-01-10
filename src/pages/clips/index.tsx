import React, { useEffect } from 'react'
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

  const onMessage = (message: MessageEvent) => {
    if (message.data.type === 'IMPORT_BOOKMARKS_SUCCESS') {
      const data: chrome.bookmarks.BookmarkTreeNode = message.data.payload[0]
      // eslint-disable-next-line no-console
      console.log('data', data)
    }
  }

  const postMessage = () => {
    window.postMessage({ type: 'IMPORT_BOOKMARKS' }, window.location.toString())
  }

  useEffect(() => {
    window.addEventListener('message', onMessage)
    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [onMessage])

  return (
    <Layout>
      {profile && !isLoading && (
        <>
          <ProfileFolderList />
          <AddFolder />
          <Link href={`/clips/${profile.username}`}>
            <LinkButton>Your public profile</LinkButton>
          </Link>
          {isDev && <Button onClick={postMessage}>Import bookmarks from bookmark bar</Button>}
        </>
      )}
    </Layout>
  )
}

export default Clips
