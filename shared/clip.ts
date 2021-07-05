import { mutate } from 'swr'
import { getAppUrl } from './app-url'
import { PROFILE_PATH } from './hooks/useProfile'

export const addClip = async (clip: { title: string; url: string | null }, callback?: () => void): Promise<void> => {
  callback && callback()
  await fetch(`${getAppUrl()}/api/clip`, {
    method: 'POST',
    body: JSON.stringify(clip),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await mutate(PROFILE_PATH)
}

export const removeClip = async (clipId: string, callback?: () => void): Promise<void> => {
  callback && callback()
  await fetch(`${getAppUrl()}/api/clip/${clipId}`, { method: 'DELETE' })
  await mutate(PROFILE_PATH)
}
