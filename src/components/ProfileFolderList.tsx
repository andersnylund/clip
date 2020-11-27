import React, { FC } from 'react'
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd'
import styled from 'styled-components'
import { mutate, cache } from 'swr'
import { produce } from 'immer'

import { PROFILE_PATH, useProfile } from '../hooks/useProfile'
import { Clip, User } from '../types'
import { ProfileFolder } from './ProfileFolder'

const reorderClip = async (
  draggableId: string,
  source: DraggableLocation,
  destination: DraggableLocation
): Promise<void> => {
  const cachedUser: User = cache.get(PROFILE_PATH)

  // TODO: remove istanbul ignore
  /* istanbul ignore next */
  const user = produce(cachedUser, (draftUser) => {
    const folder = draftUser.folders.find((folder) => folder.id === destination.droppableId)
    const previousFolder = draftUser.folders.find((folder) => folder.id === source.droppableId)
    const clip = draftUser.folders.reduce((prev: Clip | undefined, curr) => {
      if (prev) {
        return prev
      }
      return curr.clips.find((clip) => clip.id === draggableId)
    }, undefined)
    if (folder && clip) {
      const newClip = produce(clip, (draftClip) => {
        draftClip.orderIndex = destination.index
      })
      const clips = folder.clips.filter((c) => c.id !== draggableId)
      clips.splice(destination.index ?? 0, 0, newClip)
      folder.clips = clips
      if (previousFolder && source.droppableId !== destination.droppableId) {
        previousFolder.clips = previousFolder.clips.filter((clip) => clip.id !== draggableId)
      }
    }
  })

  mutate(PROFILE_PATH, user, false)

  await fetch(`/api/clip/${draggableId}`, {
    method: 'PUT',
    body: JSON.stringify({
      orderIndex: destination.index,
      folderId: destination.droppableId,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  mutate(PROFILE_PATH)
}

export const ProfileFolderList: FC = () => {
  const { profile } = useProfile()

  // TODO: remove istanbul ignore
  /* istanbul ignore next */
  const handleOnDragEnd = async (dropResult: DropResult): Promise<void> => {
    const { draggableId, source, type, destination } = dropResult

    if (destination?.droppableId === source?.droppableId && destination.index === source.index) {
      return
    }

    if (!source || !destination) {
      return
    }

    if (type === 'CLIP') {
      return reorderClip(draggableId, source, destination)
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <List>
        {profile?.folders.map((folder) => (
          <ProfileFolder key={folder.id} folder={folder} />
        ))}
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
