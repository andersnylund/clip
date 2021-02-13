import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { AddClip } from '../../components/AddClip'
import { Button, LinkButton } from '../../components/buttons'
import { Layout } from '../../components/Layout'
import { ProfileClipList } from '../../components/ProfileClipList'
import { PROFILE_PATH, useProfile } from '../../hooks/useProfile'
import { isSiteEnvDev } from '../../hooks/usePublicRuntimeConfig'
import { Clip } from '../../types'

type SimpleClip = Omit<Clip, 'userId' | 'clips'> & {
  clips: SimpleClip[]
}

interface Props {
  sendBookmarks?: (bookmarks: chrome.bookmarks.BookmarkTreeNode) => void
}

const mapBookmarkToClip = (bookmark: chrome.bookmarks.BookmarkTreeNode): SimpleClip => {
  return {
    clips: bookmark.children?.map((b) => mapBookmarkToClip(b)) || [],
    id: bookmark.id,
    index: 0,
    parentId: bookmark.parentId || null,
    title: bookmark.title,
    url: bookmark.url || null,
  }
}

const importClips = async (clips: SimpleClip[]) => {
  await fetch('/api/clips/import', {
    method: 'POST',
    body: JSON.stringify({ clips }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  mutate(PROFILE_PATH)
}

const Clips: NextPage<Props> = () => {
  const { profile, isLoading } = useProfile()
  const isDev = isSiteEnvDev()

  const onMessage = (message: MessageEvent<{ type: string; payload: chrome.bookmarks.BookmarkTreeNode }>) => {
    if (message.data.type === 'IMPORT_BOOKMARKS_SUCCESS') {
      const rootBookmark: chrome.bookmarks.BookmarkTreeNode = message.data.payload
      // FIXME: differentiate chrome and firefox
      const bookmarkBar = rootBookmark.children?.find((bookmark) => bookmark.id === 'toolbar_____')
      if (bookmarkBar?.children) {
        const clips = bookmarkBar.children.map(mapBookmarkToClip)
        importClips(clips)
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
