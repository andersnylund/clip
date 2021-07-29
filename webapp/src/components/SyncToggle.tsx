import React, { FC } from 'react'
import { mutate } from 'swr'
import { v4 as uuidv4 } from 'uuid'
import { getAppUrl } from '../../../shared/app-url'
import { PROFILE_PATH, useProfile } from '../../../shared/hooks/useProfile'
import { TOGGLE_SYNC } from '../../../shared/message-types'
import { isSiteEnvDev } from '../hooks/usePublicConfig'
import { Toggle } from './Toggle'

const toggleSync = async (checked: boolean) => {
  const syncId = uuidv4()
  const payload = {
    syncEnabled: checked,
    syncId: checked ? syncId : null,
  }
  await fetch(getAppUrl() + `/api/profile/toggle-sync`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await mutate(PROFILE_PATH)
  window.postMessage({ type: TOGGLE_SYNC, payload }, window.location.toString())
}

export const SyncToggle: FC = () => {
  const { profile } = useProfile()

  return isSiteEnvDev() ? (
    <div className="pt-12">
      <div className="flex flex-col gap-2 pb-4 items-center w-3/4 max-w-xl mx-auto text-center text-gray-600 text-sm">
        <p className="text-yellow-800">
          <strong>Enabling cross browser syncing might cause data loss</strong>. In each browser where you install the
          clip.so extension, the browser&apos;s toolbar folders and bookmarks will be overriden with folders and
          bookmarks that you have stored in <strong>clip.so</strong>.
        </p>
        <span className="text-lg" role="img" aria-label="Warning">
          ⚠️
        </span>
      </div>
      <Toggle label="Enable cross browser syncing" checked={Boolean(profile?.syncEnabled)} onToggle={toggleSync} />
    </div>
  ) : null
}
