import React, { useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/client'

import { Layout } from '../components/Layout'
import { Button } from '../components/styles'

const AddFolder: NextPage = () => {
  const [folderName, setFolderName] = useState('')
  const [session] = useSession()
  const router = useRouter()

  const postFolder = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault()
    fetch('/api/folder', {
      body: JSON.stringify({ name: folderName }),
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    setFolderName('')
  }

  useEffect(() => {
    if (!session) {
      router.push('/api/auth/signin')
    }
  }, [session])

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
