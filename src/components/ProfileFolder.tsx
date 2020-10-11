import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'

import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { Folder } from '../types'
import { AddClip } from './AddClip'
import { Button } from './buttons'
import { ProfileClipList } from './ProfileClipList'

const deleteFolder = async (folderId: string) => {
  await fetch(`/api/folder/${folderId}`, {
    method: 'DELETE',
  })
  await mutate(PROFILE_PATH)
}

interface Props {
  folder: Folder & {
    id: string | 'uncategorized'
  }
}

export const ProfileFolder: FC<Props> = ({ folder }) => {
  const { profile } = useProfile()
  const [isAddClipOpen, setIsAddClipOpen] = useState(false)

  if (!profile) {
    return null
  }

  const isUncategorized = folder.id !== 'uncategorized'

  return (
    <Container>
      <Header>
        <h3>{folder.name}</h3>
        {isUncategorized && <Button onClick={() => deleteFolder(folder.id)}>✕</Button>}
      </Header>
      <ProfileClipList clips={folder.clips} />
      {isUncategorized && (
        <OpenAddInput isAddClipOpen={isAddClipOpen} onClick={() => setIsAddClipOpen(!isAddClipOpen)}>
          <div>{isAddClipOpen ? 'Close' : 'New'}</div>
          <ClipImage src="/clip.svg" alt="Clip" />
        </OpenAddInput>
      )}
      {isAddClipOpen && <AddClip folder={folder} profile={profile} />}
    </Container>
  )
}

const Header = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const OpenAddInput = styled(Button)<{ isAddClipOpen: boolean }>`
  align-self: center;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  justify-content: center;
  margin-top: 16px;
  visibility: ${({ isAddClipOpen }): string => (isAddClipOpen ? 'visible' : 'hidden')};
`

const Container = styled.li`
  background-color: #eee;
  border-radius: 8px;
  border: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  padding: 16px;

  &:hover {
    ${OpenAddInput} {
      visibility: visible;
    }
  }
`

const ClipImage = styled.img`
  height: 18px;
`
