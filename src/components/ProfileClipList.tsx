import React, { FC } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'

import { PROFILE_PATH } from '../hooks/useProfile'
import { Clip } from '../types'

const deleteClip = async (clipId: string) => {
  await fetch(`/api/clip/${clipId}`, {
    method: 'DELETE',
  })
  await mutate(PROFILE_PATH)
}

export const ProfileClipList: FC<{ clips: Clip[] }> = ({ clips }) => {
  return (
    <ClipList>
      {clips.map((clip) => (
        <ClipListItem key={clip.id}>
          <Link href={clip.url}>{clip.name}</Link>
          <DeleteButton onClick={() => deleteClip(clip.id)}>✕</DeleteButton>
        </ClipListItem>
      ))}
    </ClipList>
  )
}

const ClipList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  visibility: hidden;

  &:hover {
    color: lightgray;
    cursor: pointer;
  }
`

const ClipListItem = styled.li`
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  margin: 8px;
  overflow: hidden;
  padding: 8px;

  &:hover {
    ${DeleteButton} {
      visibility: initial;
    }
  }
`

const Link = styled.a`
  text-decoration: none;
  color: black;
`
