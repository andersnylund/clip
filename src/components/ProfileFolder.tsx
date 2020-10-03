import React, { FC } from 'react'
import styled from 'styled-components'

import { useProfile } from '../hooks/useProfile'
import { Input } from '../text-styles'
import { Folder } from '../types'
import { AddClip } from './AddClip'
import { ProfileClipList } from './ProfileClipList'

export const ProfileFolder: FC<{ folder: Folder }> = ({ folder }) => {
  const { profile } = useProfile()

  if (!profile) {
    return null
  }

  return (
    <Container>
      <p>{folder.name}</p>
      <ProfileClipList clips={folder.clips} />
      <AddClip folder={folder} profile={profile} />
    </Container>
  )
}

const Container = styled.li`
  border-radius: 8px;
  border: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  padding: 16px;
  background-color: #eee;

  ${Input} {
    margin: 8px 0;
  }
`
