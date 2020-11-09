import React, { FC } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { mutate, cache } from 'swr'

import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { User } from '../types'
import { ProfileFolder } from './ProfileFolder'

export const ProfileFolderList: FC = () => {
  const { profile } = useProfile()

  const uncategorizedClips = profile?.clips.filter((clip) => !clip.folderId)

  const handleOnDragEnd = async ({ draggableId, type, source, destination }: DropResult): Promise<void> => {
    if (type !== 'CLIP' || (destination?.droppableId === source?.droppableId && destination.index === source.index)) {
      return
    }

    // TODO: use immer
    const user: User = cache.get(PROFILE_PATH)

    await fetch(`/api/clip/${draggableId}`, {
      method: 'PUT',
      body: JSON.stringify({
        orderIndex: destination?.index,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    await mutate(PROFILE_PATH)
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <List>
        {profile?.folders.map((folder) => (
          <ProfileFolder key={folder.id} folder={folder} />
        ))}
        {uncategorizedClips && uncategorizedClips.length > 0 && (
          <ProfileFolder folder={{ id: 'uncategorized', clips: uncategorizedClips, name: 'Uncategorized' }} />
        )}
      </List>
    </DragDropContext>
  )
}

const List = styled.ul`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  list-style-type: none;
  margin: 2rem 0;
  max-width: 1200px;
  padding: 0;
  width: 100%;
`
