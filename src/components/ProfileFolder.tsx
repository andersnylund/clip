import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { Input } from '../text-styles'

import { Clip, Folder } from '../types'
import { Button } from './buttons'
import { ProfileClipList } from './ProfileClipList'

export const ProfileFolder: FC<{ folder: Folder }> = ({ folder }) => {
  const [value, setValue] = useState('')
  const { profile } = useProfile()

  if (!profile) {
    return null
  }

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
    <Container>
      <p>{folder.name}</p>
      <ProfileClipList clips={folder.clips} />
      <Input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Clip url" />
      <Button onClick={submitClip}>
        +{' '}
        <span role="img" aria-label="clip">
          📎
        </span>
      </Button>
    </Container>
  )
}

const Container = styled.li`
  border-radius: 8px;
  border: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #eee;

  ${Input} {
    margin: 8px 0;
  }
`
