import React, { useEffect } from 'react'
import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'

import { Layout } from '../../components/Layout'
import { useProfile } from '../../hooks/useProfile'
import { ProfileClipList } from '../../components/ProfileClipList'
import { AddClip } from '../../components/AddClip'
import { isSiteEnvDev } from '../../hooks/usePublicRuntimeConfig'
import { Button, LinkButton } from '../../components/buttons'

interface Props {
  sendBookmarks?: (bookmarks: chrome.bookmarks.BookmarkTreeNode) => void
}

const Clips: NextPage<Props> = ({ sendBookmarks }) => {
  const { profile, isLoading } = useProfile()
  const isDev = isSiteEnvDev()

  const onMessage = (message: MessageEvent<{ type: string; payload: chrome.bookmarks.BookmarkTreeNode }>) => {
    if (message.data.type === 'IMPORT_BOOKMARKS_SUCCESS') {
      const rootBookmark: chrome.bookmarks.BookmarkTreeNode = message.data.payload
      if (sendBookmarks) {
        sendBookmarks(rootBookmark)
      }
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
          <Container>
            <ProfileClipList clips={profile.clips} />
          </Container>
          <AddClip />
          <Link href={`/clips/${profile.username}`}>
            <LinkButton>Your public profile</LinkButton>
          </Link>
          {isDev && <Button onClick={postMessage}>Import bookmarks from bookmark bar</Button>}
        </>
      )}
    </Layout>
  )
}

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
`

export default Clips
