import React, { FC } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { Draggable, Droppable } from 'react-beautiful-dnd'

import { PROFILE_PATH } from '../hooks/useProfile'
import { Folder } from '../types'

const deleteClip = async (clipId: string) => {
  await fetch(`/api/clip/${clipId}`, {
    method: 'DELETE',
  })
  await mutate(PROFILE_PATH)
}

export const ProfileClipList: FC<{ folder: Folder }> = ({ folder: { clips, id: folderId } }) => {
  return (
    <Droppable droppableId={folderId} type="CLIP">
      {(droppable) => (
        <ClipList ref={droppable.innerRef} {...droppable.droppableProps}>
          {clips.map((clip, index) => (
            <Draggable key={clip.id} draggableId={clip.id} index={index}>
              {(draggable) => (
                <ClipListItem ref={draggable.innerRef} {...draggable.draggableProps} {...draggable.dragHandleProps}>
                  <Link href={clip.url}>{clip.name}</Link>
                  <DeleteButton onClick={() => deleteClip(clip.id)}>✕</DeleteButton>
                </ClipListItem>
              )}
            </Draggable>
          ))}
          {droppable.placeholder}
        </ClipList>
      )}
    </Droppable>
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
