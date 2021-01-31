import React, { FC } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { mutate } from 'swr'

import { Clip as ClipType } from '../types'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Button } from './buttons'

const removeClip = async (clipId: string) => {
  await fetch(`/api/clip/${clipId}`, { method: 'DELETE' })
  mutate(PROFILE_PATH)
}

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

  const style = { transform: CSS.Translate.toString(transform) }

  if (clip.url) {
    return (
      <ClipListItem style={style} ref={setDraggableNodeRef} {...attributes} {...listeners}>
        <Link href={clip.url || ''}>
          <A>{clip.title}</A>
        </Link>
        <Button onClick={() => removeClip(clip.id)}>ⅹ</Button>
      </ClipListItem>
    )
  }
  return (
    <div style={style} ref={setDraggableNodeRef} {...attributes} {...listeners}>
      <Droppable ref={setDroppableRef} isOver={isOver}>
        <Button onClick={() => removeClip(clip.id)}>ⅹ</Button>
        <h2>{clip.title}</h2>
        <Container>
          {clip.clips.map((clip) => (
            <Clip key={clip.id} clip={clip} />
          ))}
        </Container>
      </Droppable>
    </div>
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

const A = styled.a`
  color: black;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
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
