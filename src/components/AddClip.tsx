import React, { FC, useState } from 'react'
import { mutate } from 'swr'

import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Clip, Folder, User } from '../types'
import { Button } from './buttons'

interface Props {
  folder: Folder
  profile: User
}

export const AddClip: FC<Props> = ({ folder, profile }) => {
  const [value, setValue] = useState('')

  const submitClip = async () => {
    const clip: Omit<Clip, 'id'> = {
      folderId: folder.id,
      name: value,
      url: value,
      userId: profile?.id,
    }
    await fetch('/api/clip', {
      method: 'POST',
      body: JSON.stringify(clip),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setValue('')
    await mutate(PROFILE_PATH)
  }

  return (
    <>
      <Input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Clip url" />
      <Button onClick={submitClip}>
        +{' '}
        <span role="img" aria-label="clip">
          📎
        </span>
      </Button>
    </>
  )
}
