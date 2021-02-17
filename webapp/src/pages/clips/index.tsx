import { NextPage } from 'next'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { getBrowserName, supportedBrowsers } from '../../browser'
import { AddClip } from '../../components/AddClip'
import { Button, LinkButton } from '../../components/buttons'
import { Layout } from '../../components/Layout'
import { ProfileClipList } from '../../components/ProfileClipList'
import { StyledModal } from '../../components/StyledModal'
import { PROFILE_PATH, useProfile } from '../../hooks/useProfile'
import { isSiteEnvDev } from '../../hooks/usePublicRuntimeConfig'
import { Clip } from '../../types'

type SimpleClip = Omit<Clip, 'userId' | 'clips'> & {
  clips: SimpleClip[]
}

const mapBookmarkToClip = (bookmark: chrome.bookmarks.BookmarkTreeNode): SimpleClip => {
  return {
    clips: bookmark.children?.map((b) => mapBookmarkToClip(b)) || [],
    id: bookmark.id,
    index: 0,
    parentId: bookmark.parentId || /* istanbul ignore next */ null,
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

const Clips: NextPage = () => {
  const [isInvalidBrowser, setIsInvalidBrowser] = useState(false)
  const { profile, isLoading } = useProfile()
  const isDev = isSiteEnvDev()
  const browserName = getBrowserName()

  const onMessage = (message: MessageEvent<{ type: string; payload: chrome.bookmarks.BookmarkTreeNode }>) => {
    if (message.data.type === 'IMPORT_BOOKMARKS_SUCCESS') {
      const rootBookmark: chrome.bookmarks.BookmarkTreeNode = message.data.payload
      const isFirefox = browserName === 'Firefox'
      const bookmarkBar = rootBookmark.children?.find((b) =>
        isFirefox ? b.id === 'toolbar_____' : b.title === 'Bookmarks Bar'
      )
      const clips = bookmarkBar?.children?.map(mapBookmarkToClip)
      if (clips) {
        importClips(clips)
      }
    }
  }

  const postMessage = () => {
    if (!supportedBrowsers.includes(browserName ?? /* istanbul ignore next */ '')) {
      setIsInvalidBrowser(true)
    }
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
      <StyledModal isOpen={isInvalidBrowser}>
        <ModalContainer>
          <p>
            Only Firefox and Chrome are currently supported{' '}
            <span role="img" aria-label="sad">
              😢
            </span>
          </p>
          <Button onClick={() => setIsInvalidBrowser(false)}>Close</Button>
        </ModalContainer>
      </StyledModal>
    </Layout>
  )
}

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  text-align: center;
`

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
`

export default Clips
