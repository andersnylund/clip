import React, { useState } from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import { mutate } from 'swr'

import { useSignin } from '../hooks/useSignin'
import { Button } from './buttons'
import { Input, Label } from '../text-styles'
import { PROFILE_PATH } from '../hooks/useProfile'

export const AddFolder: NextPage = () => {
  const [folderName, setFolderName] = useState('')

  useSignin()

  const postFolder = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    await fetch('/api/folder', {
      body: JSON.stringify({ name: folderName }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    setFolderName('')
    await mutate(PROFILE_PATH)
  }

  return (
    <Form onSubmit={postFolder}>
      <Label>
        <Input
          placeholder="Folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          type="text"
        />
      </Label>
      <Button>Add folder</Button>
    </Form>
  )
}

const Form = styled.form`
  align-items: center;
  display: flex;
  flex-direction: column;

  margin: 16px;

  ${Button} {
    margin-top: 16px;
  }
`
