import React, { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'

import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { Input, Label } from '../text-styles'
import { Button } from './buttons'

export const UsernamePrompt: FC = () => {
  const [username, setUsername] = useState('')
  const { profile } = useProfile()

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
    }
  }, [profile])

  const updateUsername = async () => {
    await fetch(PROFILE_PATH, {
      method: 'POST',
      body: JSON.stringify({ username }),
      headers: {
        'Content-Type': 'application/json',
      },
    }),
      await mutate(PROFILE_PATH)
  }

  return (
    <Container>
      <Label>
        <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      </Label>
      {username && username !== '' && <Button onClick={updateUsername}>Set</Button>}
    </Container>
  )
}

const Container = styled.div`
  display: grid;
  grid-gap: 8px;
  justify-items: center;
`
