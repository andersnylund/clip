import React, { FC, useState } from 'react'
import { getBrowserName, supportedBrowsers } from '../browser'
import { useProfile } from '../hooks/useProfile'
import { isSiteEnvDev } from '../hooks/usePublicRuntimeConfig'
import { Button } from './buttons'
import { NotSupportedModal } from './NotSupportedModal'

export const Export: FC = () => {
  const { profile } = useProfile()
  const [isInvalidBrowser, setIsInvalidBrowser] = useState(false)
  const isDev = isSiteEnvDev()
  const browserName = getBrowserName()

  if (!profile) {
    return null
  }

  const postExportMessage = () => {
    if (!supportedBrowsers.includes(browserName ?? /* istanbul ignore next */ '')) {
      setIsInvalidBrowser(true)
    } else {
      window.postMessage({ type: 'EXPORT_BOOKMARKS', clips: profile.clips }, window.location.toString())
    }
  }

  // TODO: handle EXPORT_BOOKMARKS_SUCCESS and show success modal

  return isDev ? (
    <>
      <Button onClick={postExportMessage}>Export bookmarks to bookmark bar</Button>
      <NotSupportedModal
        isInvalidBrowser={isInvalidBrowser}
        setIsInvalidBrowser={setIsInvalidBrowser}
      ></NotSupportedModal>
    </>
  ) : null
}
