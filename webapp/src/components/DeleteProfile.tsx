import Router from 'next/router'
import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { User } from '../types'
import { Button } from './buttons'
import { StyledModal } from './StyledModal'

export const DeleteProfile: FC<{ profile?: User }> = ({ profile }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const deleteProfile = async () => {
    await fetch('/api/profile', {
      method: 'DELETE',
    })
    await mutate(PROFILE_PATH)
    await Router.push('/')
    Router.reload()
  }

  return profile ? (
    <>
      <Button color="danger" onClick={() => setIsModalOpen(!isModalOpen)}>
        Delete your profile
      </Button>
      <StyledModal isOpen={isModalOpen}>
        <Container>
          <h2>Deleting your profile is irreversible</h2>
          <h3>Are you sure you want to delete your profile?</h3>
          <Buttons>
            <Button color="danger" onClick={deleteProfile}>
              Yes
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>No</Button>
          </Buttons>
        </Container>
      </StyledModal>
    </>
  ) : null
}

const Container = styled.div`
  padding: 1rem;
`

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 2rem;
  justify-content: center;
`
