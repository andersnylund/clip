import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import Link from 'next/link'
import React, { FC, FormEvent, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Button } from './buttons'

export type ClipWithUrl = {
  id: string
  parentId: string | null
  title: string
  url: string
}

export type Props = {
  clip: ClipWithUrl
  onRemove?: () => void
}

export const ClipHeader: FC<Props> = ({ clip, onRemove }) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [clipTitle, setClipTitle] = useState(clip.title)
  const [clipUrl, setClipUrl] = useState(clip.url)

  const removeClip = async () => {
    onRemove && onRemove()
    await fetch(`/api/clip/${clip.id}`, { method: 'DELETE' })
    await mutate(PROFILE_PATH)
  }

  const updateClip = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`/api/clip/${clip.id}`, {
      body: JSON.stringify({ url: clipUrl, title: clipTitle, parentId: clip.parentId }),
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
      <Inputs>
        <Input value={clipTitle} onChange={(e) => setClipTitle(e.target.value)} />
        <Input value={clipUrl} onChange={(e) => setClipUrl(e.target.value)} />
      </Inputs>
      <Button type="submit">Save</Button>
    </EditForm>
  ) : (
    <HeaderContainer>
      <Link href={clip.url} passHref>
        <Header>{clip.title}</Header>
      </Link>
      <Buttons>
        <Button title="Edit" onClick={() => setIsEditOpen(true)}>
          <Pencil2Icon />
        </Button>
        <Button title="Remove" onClick={removeClip}>
          <TrashIcon />
        </Button>
      </Buttons>
    </HeaderContainer>
  )
}

const EditForm = styled.form`
  align-items: center;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
`

const HeaderContainer = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto auto;
  justify-content: space-between;
  width: 100%;

  ${Button} {
    visibility: hidden;
  }

  &:hover {
    ${Button} {
      visibility: initial;
    }
  }
`

const Inputs = styled.div`
  display: grid;
  grid-auto-rows: auto auto;
  grid-gap: 4px;
`

const Buttons = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  align-items: flex-end;
`

const Header = styled.a`
  color: black;
  font-size: 18px;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`
