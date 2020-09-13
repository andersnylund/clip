import React, { useState } from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import { mutate } from 'swr'

import { useSignin } from '../hooks/useSignin'
import { Button } from './buttons'
import { Label } from '../text-styles'

export const AddFolder: NextPage<{ username: string | null }> = ({ username }) => {
  const [folderName, setFolderName] = useState('')

  useSignin()

  const postFolder = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    fetch('/api/folder', {
      body: JSON.stringify({ name: folderName }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    setFolderName('')
    if (username) {
      console.log('username', username)
      mutate(`/api/clips/${username}`)
    }
  }

  return (
    <Form onSubmit={postFolder}>
      <Label>
        <p>Name</p>
        <input value={folderName} onChange={(e) => setFolderName(e.target.value)} type="text" />
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
