import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import React, { FC } from 'react'
import styled from 'styled-components'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Clip as ClipType } from '../types'
import { ClipHeader } from './ClipHeader'
import { FolderHeader } from './FolderHeader'

export const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
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

export const ProfileClipList: FC<{ clips: ClipType[] }> = ({ clips }) => (
  <DndContext onDragEnd={handleDragEnd}>
    {clips.map((clip) => (
      <Clip key={clip.id} clip={clip} />
    ))}
  </DndContext>
)

const Clip: FC<{ clip: ClipType }> = ({ clip }) => {
  const { isOver, setNodeRef: setDroppableRef } = useDroppable({
    id: clip.id,
  })

  const { attributes, listeners, setNodeRef: setDraggableNodeRef, transform } = useDraggable({
    id: clip.id,
  })

  const style = { transform: CSS.Translate.toString(transform) }

  if (clip.url) {
    const clipWithUrl: ClipType & { url: string } = { ...clip, url: clip.url }
    return (
      <ClipListItem style={style} ref={setDraggableNodeRef}>
        <Header>
          <DragHandleButton {...attributes} {...listeners}>
            <DragHandleDots2Icon />
          </DragHandleButton>
          <ClipHeader clip={clipWithUrl} />
        </Header>
      </ClipListItem>
    )
  }

  return (
    <div style={style} ref={setDraggableNodeRef}>
      <Droppable ref={setDroppableRef} isOver={isOver}>
        <DroppableHeader>
          <Header>
            <DragHandleButton {...attributes} {...listeners}>
              <DragHandleDots2Icon />
            </DragHandleButton>
            <FolderHeader folder={clip} />
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

const Droppable = styled.div<{ isOver: boolean }>`
  // TODO: fix istanbul ignore
  background-color: ${({ isOver }): string => (isOver ? /* istanbul ignore next */ '#ddd' : '#eee')};
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

const Header = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: auto 1fr auto;
  width: 100%;
`

const DragHandleButton = styled.button`
  border: none;
  background-color: inherit;
  &:hover {
    cursor: move;
  }
  display: flex;
`
