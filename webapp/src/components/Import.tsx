import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { getBrowserName, supportedBrowsers } from '../browser'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Clip } from '../types'
import { Button } from './buttons'
import { NotSupportedModal } from './NotSupportedModal'
import { StyledModal } from './StyledModal'

type SimpleClip = Omit<Clip, 'userId' | 'clips'> & {
  clips: SimpleClip[]
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

export const Import: FC = () => {
  const [modalState, setModalState] = useState<'closed' | 'warning' | 'invalidBrowser'>('closed')
  const browserName = getBrowserName()

  const handleClick = () => {
    if (!supportedBrowsers.includes(browserName ?? '')) {
      return setModalState('invalidBrowser')
    } else {
      return setModalState('warning')
    }
  }

  const postMessage = () => {
    window.postMessage({ type: 'IMPORT_BOOKMARKS' }, window.location.toString())
    setModalState('closed')
  }

  const onImportMessage = (message: MessageEvent<{ type: string; payload: chrome.bookmarks.BookmarkTreeNode }>) => {
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

  useEffect(() => {
    window.addEventListener('message', onImportMessage)
    return () => {
      window.removeEventListener('message', onImportMessage)
    }
  }, [onImportMessage])

  return (
    <>
      <Button onClick={handleClick}>Import from bookmark bar</Button>
      <NotSupportedModal isInvalidBrowser={modalState === 'invalidBrowser'} onClose={() => setModalState('closed')} />
      <StyledModal isOpen={modalState === 'warning'} onRequestClose={() => setModalState('closed')}>
        <Container>
          <WarningText>
            <span role="img" aria-label="Warning">
              ⚠️
            </span>
            <p>Importing bookmarks from bookmarks bar will overwrite your clip bookmarks</p>
          </WarningText>
          <Button color="warning" onClick={postMessage}>
            Import and overwrite
          </Button>
          <Button onClick={() => setModalState('closed')}>Cancel</Button>
        </Container>
      </StyledModal>
    </>
  )
}

export const WarningText = styled.div`
  span {
    font-size: 2rem;
  }
`

export const Container = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;

  ${Button} {
    margin-top: 0.5rem;
  }
`
