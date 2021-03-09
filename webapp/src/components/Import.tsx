import React, { FC, useEffect, useState } from 'react'
import { mutate } from 'swr'
import { getBrowserName, supportedBrowsers } from '../browser'
import { Clip } from '../types'
import { PROFILE_PATH } from '../hooks/useProfile'
import { isSiteEnvDev } from '../hooks/usePublicConfig'
import { Button } from './buttons'
import { NotSupportedModal } from './NotSupportedModal'

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

export const Import: FC = () => {
  const [isInvalidBrowser, setIsInvalidBrowser] = useState(false)

  const isDev = isSiteEnvDev()
  const browserName = getBrowserName()

  const postMessage = () => {
    if (!supportedBrowsers.includes(browserName ?? /* istanbul ignore next */ '')) {
      setIsInvalidBrowser(true)
    }
    window.postMessage({ type: 'IMPORT_BOOKMARKS' }, window.location.toString())
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

  return isDev ? (
    <>
      <Button onClick={postMessage}>Import bookmarks from bookmark bar</Button>
      <NotSupportedModal isInvalidBrowser={isInvalidBrowser} setIsInvalidBrowser={setIsInvalidBrowser} />
    </>
  ) : null
}
