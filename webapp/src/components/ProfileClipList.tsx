import React, { FC } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { mutate } from 'swr'
import { DragHandleDots2Icon, TrashIcon } from '@radix-ui/react-icons'

import { Clip as ClipType } from '../types'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Button } from './buttons'
import { ClipHeader } from './ClipHeader'

const removeClip = async (clipId: string) => {
  await fetch(`/api/clip/${clipId}`, { method: 'DELETE' })
  mutate(PROFILE_PATH)
}

export const ProfileClipList: FC<{ clips: ClipType[] }> = ({ clips }) => {
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
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
      <ClipListItem style={style} ref={setDraggableNodeRef}>
        <Header>
          <DragHandleButton {...attributes} {...listeners}>
            <DragHandleDots2Icon />
          </DragHandleButton>
          <Link href={clip.url || ''}>
            <A>{clip.title}</A>
          </Link>
          <DeleteButton title="Remove" onClick={() => removeClip(clip.id)}>
            <TrashIcon />
          </DeleteButton>
        </Header>
      </ClipListItem>
    )
  }
  return (
    <div style={style} ref={setDraggableNodeRef}>
      <Droppable ref={setDroppableRef} isOver={isOver}>
        <DroppableHeader>
          <DragHandleButton {...attributes} {...listeners}>
            <DragHandleDots2Icon />
          </DragHandleButton>
          <Header>
            <ClipHeader clip={clip} />
            <DeleteButton title="Remove" onClick={() => removeClip(clip.id)}>
              <TrashIcon />
            </DeleteButton>
          </Header>
        </DroppableHeader>
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

const DroppableHeader = styled.div`
  align-items: center;
  display: flex;
`

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const DeleteButton = styled(Button)`
  display: flex;
`

const Header = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto 1fr auto;

  ${DeleteButton} {
    visibility: hidden;
  }

  &:hover {
    ${DeleteButton} {
      visibility: initial;
    }
  }
`

const DragHandleButton = styled.button`
  border: none;
  background-color: inherit;
  &:hover {
    cursor: move;
  }
  display: flex;
`
