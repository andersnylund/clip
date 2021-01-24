import React, { FC } from 'react'
import styled from 'styled-components'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { mutate } from 'swr'

import { Clip as ClipType } from '../types'
import { PROFILE_PATH } from '../hooks/useProfile'

export const ProfileClipList: FC<{ clips: ClipType[] }> = ({ clips }) => {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    await fetch(`/api/clip/${active.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        parentId: over?.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    mutate(PROFILE_PATH)
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      {clips.map((clip) => (
        <Clip key={clip.id} clip={clip} />
      ))}
    </DndContext>
  )
}

const Clip: FC<{ clip: ClipType }> = ({ clip }) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: clip.id,
  })

  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform } = useDraggable({
    id: clip.id,
  })

  const style = transform
    ? {
        transform: CSS.Translate.toString(transform),
      }
    : undefined

  if (clip.url) {
    return (
      <ClipListItem style={style} ref={setDraggableNodeRef} {...attributes} {...listeners}>
        <Link href={clip.url || ''}>{clip.title}</Link>
      </ClipListItem>
    )
  }
  return (
    <Container style={style} ref={setDraggableNodeRef} {...attributes} {...listeners}>
      <Droppable ref={setDroppableRef} isOver={isOver}>
        <h2>{clip.title}</h2>
        {clip.clips.map((clip) => (
          <Clip key={clip.id} clip={clip} />
        ))}
      </Droppable>
    </Container>
  )
}

const ClipListItem = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  margin: 8px;
  overflow: hidden;
  padding: 8px;
`

const Link = styled.a`
  text-decoration: none;
  color: black;
`

const Droppable = styled.div<{ isOver: boolean }>`
  background-color: ${({ isOver }): string => (isOver ? '#ddd' : '#eee')};
  border-radius: 8px;
  border: 1px solid lightgrey;
  margin: 8px 0;
  padding: 16px;
  transition: 0.1s;
`

const Container = styled.div`
  display: flex;
`
