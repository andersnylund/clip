import React, { FC, FormEvent, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Clip } from '../types'
import { Button } from './buttons'

export const AddClip: FC = () => {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')

  const submitClip = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const clip: Omit<Clip, 'id' | 'userId' | 'parentId' | 'collapsed'> = {
      clips: [],
      index: null,
      title,
      url: url || null,
    }
    await fetch('/api/clip', {
      method: 'POST',
      body: JSON.stringify(clip),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    setUrl('')
    setTitle('')
    await mutate(PROFILE_PATH)
  }

  const isClip = Boolean(url && url !== '')
  const hasTitle = Boolean(title)

  return (
    <Form method="POST" onSubmit={submitClip}>
      <Input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
      <Input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <StyledButton disabled={!hasTitle}>
        <div>{isClip ? 'Add clip' : 'Add folder'}</div>
        <ClipImage src="/clip.svg" alt="Clip" />
      </StyledButton>
    </Form>
  )
}

const Form = styled.form`
  margin: 8px 0;
  align-items: center;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 8px;
`

const StyledButton = styled(Button)`
  justify-self: center;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  justify-content: center;
`

const ClipImage = styled.img`
  height: 18px;
`
