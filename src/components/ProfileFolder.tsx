import React, { FC, useState } from 'react'
import styled from 'styled-components'

import { useProfile } from '../hooks/useProfile'
import { Folder } from '../types'
import { AddClip } from './AddClip'
import { Button } from './buttons'
import { ProfileClipList } from './ProfileClipList'

export const ProfileFolder: FC<{ folder: Folder }> = ({ folder }) => {
  const { profile } = useProfile()

  const [isAddClipOpen, setIsAddClipOpen] = useState(false)

  if (!profile) {
    return null
  }

  return (
    <Container>
      <p>{folder.name}</p>
      <ProfileClipList clips={folder.clips} />
      <OpenAddInput isAddClipOpen={isAddClipOpen} onClick={() => setIsAddClipOpen(!isAddClipOpen)}>
        <div>{isAddClipOpen ? 'Close' : 'Add'}</div>
        <ClipImage src="/clip.svg" alt="Clip" />
      </OpenAddInput>
      {isAddClipOpen && <AddClip folder={folder} profile={profile} />}
    </Container>
  )
}

const OpenAddInput = styled(Button)<{ isAddClipOpen: boolean }>`
  align-self: center;
  display: grid;
  grid-gap: 4px;
  grid-template-columns: auto auto;
  justify-content: center;
  visibility: ${({ isAddClipOpen }): string => (isAddClipOpen ? 'visible' : 'hidden')};
`

const Container = styled.li`
  border-radius: 8px;
  border: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #eee;

  &:hover {
    ${OpenAddInput} {
      visibility: visible;
    }
  }
`

const ClipImage = styled.img`
  height: 18px;
`
