import React, { FC, FormEvent, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'

import { PROFILE_PATH } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Folder } from '../types'
import { Button } from './buttons'

export const FolderHeader: FC<{ folder: Folder }> = ({ folder }) => {
  const [editFolderValue, setEditFolderValue] = useState<string | undefined>(undefined)
  const [folderName, setFolderName] = useState(folder.name)

  const updateFolder = async (e: FormEvent) => {
    e.preventDefault()
    await fetch(`/api/folder/${folder.id}`, {
      body: JSON.stringify({ folderName }),
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await mutate(PROFILE_PATH)
    setEditFolderValue(undefined)
  }

  return editFolderValue ? (
    <EditForm onSubmit={updateFolder}>
      <Input
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        onBlur={() => setEditFolderValue(undefined)}
      />
      <Button>Save</Button>
    </EditForm>
  ) : (
    <Header onClick={() => setEditFolderValue(folder.name)}>{folder.name}</Header>
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
