import React, { FC } from 'react'
import { DragDropContext, DropResult, Draggable, Droppable, DraggableLocation } from 'react-beautiful-dnd'
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

const reorderFolder = async (draggableId: string, destination: DraggableLocation): Promise<void> => {
  const cachedUser: User = cache.get(PROFILE_PATH)

  // TODO: remove istanbul ignore
  /* istanbul ignore next */
  const user = produce(cachedUser, (draftUser) => {
    const folders = draftUser.folders.filter((folder) => folder.id !== draggableId)
    const folder = draftUser.folders.find((folder) => folder.id === draggableId)

    if (folder) {
      folders.splice(destination.index ?? 0, 0, folder)
      draftUser.folders = folders
    }
  })

  mutate(PROFILE_PATH, user, false)

  await fetch(`/api/folder/${draggableId}`, {
    method: 'PUT',
    body: JSON.stringify({
      orderIndex: destination.index,
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

    if (type === 'FOLDER') {
      return reorderFolder(draggableId, destination)
    }
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="droppable-folder" type="FOLDER">
        {(droppable) => (
          <List ref={droppable.innerRef} {...droppable.droppableProps}>
            {profile?.folders.map((folder, index) => (
              <Draggable key={folder.id} draggableId={folder.id} index={index}>
                {(draggable) => (
                  <div ref={draggable.innerRef} {...draggable.draggableProps} {...draggable.dragHandleProps}>
                    <ProfileFolder folder={folder} />
                  </div>
                )}
              </Draggable>
            ))}
            {droppable.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  )
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
  list-style-type: none;
  margin: 2rem 0;
  max-width: 600px;
  padding: 0;
  width: 100%;
`
