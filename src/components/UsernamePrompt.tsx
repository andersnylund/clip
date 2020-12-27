import React, { FC, useEffect, useState, FormEvent } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'

import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { Input, Label } from '../text-styles'
import { Button } from './buttons'

export const UsernamePrompt: FC<{ defaultOpen?: boolean }> = ({ defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [username, setUsername] = useState('')
  const { profile } = useProfile()

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
    }
  }, [profile])

  const updateUsername = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await fetch(PROFILE_PATH, {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
      setIsOpen(false)
    await mutate(PROFILE_PATH)
  }

  return isOpen ? (
    <>
      <Form onSubmit={(e) => updateUsername(e)}>
        <Label>
          <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Label>
        {username && username !== '' && <Button>Set</Button>}
      </Form>
    </>
  ) : (
    <Button onClick={() => setIsOpen(true)}>{profile?.username}</Button>
  )
}

const Form = styled.form`
  display: grid;
  grid-gap: 8px;
  justify-items: center;
`
