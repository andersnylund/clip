import React, { useState } from 'react'
import { NextPage } from 'next'

import { Layout } from '../components/Layout'

const add: NextPage = () => {
  const [folderName, setFolderName] = useState('')

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
        <button>Submit</button>
      </form>
    </Layout>
  )
}

export default add
