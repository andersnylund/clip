import React, { FC } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { mutate, cache } from 'swr'
import { produce } from 'immer'

import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { User } from '../types'
import { ProfileFolder } from './ProfileFolder'

export const ProfileFolderList: FC = () => {
  const { profile } = useProfile()

  const uncategorizedClips = profile?.clips.filter((clip) => !clip.folderId)

  // TODO: remove istanbul ignore
  /* istanbul ignore next */
  const handleOnDragEnd = async ({ draggableId, type, source, destination }: DropResult): Promise<void> => {
    if (type !== 'CLIP' || (destination?.droppableId === source?.droppableId && destination.index === source.index)) {
      return
    }

    if (!source || !destination) {
      return
    }

    const cachedUser: User = cache.get(PROFILE_PATH)

    const user = produce(cachedUser, (draftUser) => {
      const folder = draftUser.folders.find((folder) => folder.id === destination.droppableId)
      const clip = folder?.clips.find((clip) => clip.id === draggableId)
      if (folder && clip) {
        const newClip = produce(clip, (draftClip) => {
          draftClip.orderIndex = destination.index
        })
        const clips = folder.clips.filter((c) => c.id !== draggableId)
        clips.splice(destination.index ?? 0, 0, newClip)
        folder.clips = clips
      }
    })

    mutate(PROFILE_PATH, user, false)

    await fetch(`/api/clip/${draggableId}`, {
      method: 'PUT',
      body: JSON.stringify({
        orderIndex: destination?.index,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
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
