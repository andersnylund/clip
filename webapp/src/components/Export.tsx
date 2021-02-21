import React, { FC, useEffect, useState } from 'react'
import { getBrowserName, supportedBrowsers } from '../browser'
import { useProfile } from '../hooks/useProfile'
import { Button } from './buttons'
import { NotSupportedModal } from './NotSupportedModal'

export const Export: FC = () => {
  const { profile } = useProfile()
  const [isInvalidBrowser, setIsInvalidBrowser] = useState(false)

  const browserName = getBrowserName()

  const postExportMessage = () => {
    if (!supportedBrowsers.includes(browserName ?? /* istanbul ignore next */ '')) {
      setIsInvalidBrowser(true)
    }
    window.postMessage({ type: 'EXPORT_BOOKMARKS', clips: profile?.clips ?? [] }, window.location.toString())
  }

  const onExportMessage = (message: MessageEvent<{ type: string; payload: chrome.bookmarks.BookmarkTreeNode }>) => {
    if (message.data.type === 'EXPORT_BOOKMARKS_SUCCESS') {
      // TODO: show success modal?
    }
  }

  useEffect(() => {
    window.addEventListener('message', onExportMessage)
    return () => {
      window.removeEventListener('message', onExportMessage)
    }
  }, [onExportMessage])

  return (
    <>
      <Button onClick={postExportMessage}>Export bookmarks to bookmark bar</Button>
      <NotSupportedModal
        isInvalidBrowser={isInvalidBrowser}
        setIsInvalidBrowser={setIsInvalidBrowser}
      ></NotSupportedModal>
    </>
  )
}
