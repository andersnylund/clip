import React, { FC, useEffect, useState } from 'react'
import { getAppUrl } from '../../../shared/app-url'
import { useProfile } from '../../../shared/hooks/useProfile'
import { getBookmarkBar } from '../background/bookmark-bar'

const Popup: FC = () => {
  const { profile, isLoading } = useProfile()
  const [bookmarks, setBookmarks] = useState<any>()

  useEffect(() => {
    const getBookmarks = async () => {
      const bookmarkBar = await getBookmarkBar()
      setBookmarks(bookmarkBar)
    }
    getBookmarks()
  }, [])

  return (
    <div className="p-12 flex flex-col gap-4 justify-center items-center">
      {JSON.stringify(bookmarks, null, 2)}
      <h1 className="text-2xl">clip.so</h1>
      {!isLoading && (
        <div>
          {profile ? (
            <span>Logged in as {profile.name}</span>
          ) : (
            <span>
              Not logged in. Log in at{' '}
              <a className="text-black underline" href={getAppUrl()}>
                {getAppUrl()}
              </a>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default Popup
