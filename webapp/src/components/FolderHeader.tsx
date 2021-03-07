import { Pencil2Icon, TrashIcon } from '@radix-ui/react-icons'
import React, { FC, FormEvent, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Clip } from '../types'
import { Button } from './buttons'

const removeClip = async (clipId: string) => {
  await fetch(`/api/clip/${clipId}`, { method: 'DELETE' })
  mutate(PROFILE_PATH)
}

export const FolderHeader: FC<{ folder: Clip }> = ({ folder }) => {
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false)
  const [folderTitle, setFolderTitle] = useState(folder.title)

  const updateFolder = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`/api/clip/${folder.id}`, {
      body: JSON.stringify({ title: folderTitle, parentId: folder.parentId }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await mutate(PROFILE_PATH)
    setIsEditOpen(false)
  }

  return isEditOpen ? (
    <EditForm onSubmit={updateFolder}>
      <Input value={folderTitle} onChange={(e) => setFolderTitle(e.target.value)} onBlur={() => setIsEditOpen(false)} />
      <Button type="submit">Save</Button>
    </EditForm>
  ) : (
    <HeaderContainer>
      <Header>{folder.title}</Header>
      <Buttons>
        <Button title="Edit" onClick={() => setIsEditOpen(true)}>
          <Pencil2Icon />
        </Button>
        <Button title="Remove" onClick={() => removeClip(folder.id)}>
          <TrashIcon />
        </Button>
      </Buttons>
    </HeaderContainer>
  )
}

const EditForm = styled.form`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
`

const HeaderContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;

  ${Button} {
    visibility: hidden;
  }

  &:hover {
    ${Button} {
      visibility: initial;
    }
  }
`

const Buttons = styled.div`
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  padding: 0 16px;
`

const Header = styled.p`
  font-size: 18px;
  font-weight: bold;
`
