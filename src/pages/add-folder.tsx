import React, { useState } from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { Button } from '../styles'
import { useSignin } from '../hooks/useSignin'

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
    <Layout>
      <form onSubmit={postFolder}>
        <label>
          Name
          <input value={folderName} onChange={(e) => setFolderName(e.target.value)} type="text" />
        </label>
        <Button>Submit</Button>
      </form>
    </Layout>
  )
}

export default AddFolder
