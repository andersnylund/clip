import React, { FC, FormEvent, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'

import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Clip } from '../../../types'
import { Button } from './buttons'

export const ClipHeader: FC<{ clip: Clip }> = ({ clip }) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [clipTitle, setClipTitle] = useState(clip.title)

  const updateClip = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`/api/clip/${clip.id}`, {
      body: JSON.stringify({ title: clipTitle, parentId: clip.parentId }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await mutate(PROFILE_PATH)
    setIsEditOpen(false)
  }

  return isEditOpen ? (
    <EditForm onSubmit={updateClip}>
      <Input value={clipTitle} onChange={(e) => setClipTitle(e.target.value)} onBlur={() => setIsEditOpen(false)} />
      <Button type="submit">Save</Button>
    </EditForm>
  ) : (
    <Header onClick={() => setIsEditOpen(true)}>{clip.title}</Header>
  )
}

const EditForm = styled.form`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
`

const Header = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  margin: 0;
`
