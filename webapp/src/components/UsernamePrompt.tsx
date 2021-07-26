import React, { FC, FormEvent, useEffect, useState } from 'react'
import { mutate } from 'swr'
import { getAppUrl } from '../../../shared/app-url'
import { PROFILE_PATH, useProfile } from '../../../shared/hooks/useProfile'
import { Input, Label } from '../text-styles'
import { TransparentButton } from './buttons'

export const UsernamePrompt: FC<{ defaultOpen?: boolean }> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [username, setUsername] = useState('')
  const { profile } = useProfile()

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
    }
  }, [profile])

  const updateUsername = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch(getAppUrl() + PROFILE_PATH, {
      method: 'PUT',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
      setIsOpen(false)
    await mutate(PROFILE_PATH)
  }

  return isOpen ? (
    <>
      <form className="flex flex-col" onSubmit={(e) => updateUsername(e)}>
        <Label>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Label>
        {username && username !== '' && <TransparentButton className="pt-4">Set</TransparentButton>}
      </form>
    </>
  ) : (
    <TransparentButton title="Update username" onClick={() => setIsOpen(true)}>
      {profile?.username}
    </TransparentButton>
  )
}
