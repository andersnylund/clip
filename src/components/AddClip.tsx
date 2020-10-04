import React, { FC, useState } from 'react'
import styled from 'styled-components'
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
    <Container>
      <Input type="text" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Clip url" />
      <StyledButton onClick={submitClip}>
        <div>Add</div>
        <ClipImage src="/clip.svg" alt="Clip" />
      </StyledButton>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;

  ${Input} {
    margin: 8px 0;
  }
`

const StyledButton = styled(Button)`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  justify-content: center;
`

const ClipImage = styled.img`
  height: 18px;
`
