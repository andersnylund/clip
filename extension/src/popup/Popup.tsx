import React, { FC } from 'react'
import { getAppUrl } from '../../../shared/app-url'
import { useProfile } from '../../../shared/hooks/useProfile'

const Popup: FC = () => {
  const { profile, isLoading } = useProfile()

  return (
    <div className="p-12 flex flex-col gap-4 justify-center items-center">
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
