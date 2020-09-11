import React, { useState } from 'react'
import { NextPage } from 'next'

import { useSignin } from '../hooks/useSignin'
import { Button } from './buttons'

const AddFolder: NextPage = () => {
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
  }

  return (
    <form onSubmit={postFolder}>
      <label>
        Name
        <input value={folderName} onChange={(e) => setFolderName(e.target.value)} type="text" />
      </label>
      <Button>Submit</Button>
    </form>
  )
}

export default AddFolder
