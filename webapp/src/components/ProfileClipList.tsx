import React, { FC } from 'react'
import styled from 'styled-components'
import { DndContext } from '@dnd-kit/core'

import { Clip as ClipType } from '../types'

export const ProfileClipList: FC<{ clips: ClipType[] }> = ({ clips }) => (
  <DndContext>
    {clips.map((clip) => (
      <Clip key={clip.id} clip={clip} />
    ))}
  </DndContext>
)

const Clip: FC<{ clip: ClipType }> = ({ clip }) => {
  if (clip.url) {
    return (
      <ClipListItem key={clip.id}>
        <Link href={clip.url || ''}>{clip.title}</Link>
      </ClipListItem>
    )
  }
  return (
    <Container>
      <h2>{clip.title}</h2>
      <ClipList>
        {clip.clips.map((clip) => (
          <Clip key={clip.id} clip={clip} />
        ))}
      </ClipList>
    </Container>
  )
}

const ClipListItem = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
  margin: 8px;
  overflow: hidden;
  padding: 8px;
`

const ClipList = styled.div`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const Link = styled.a`
  text-decoration: none;
  color: black;
`

const Container = styled.div`
  background-color: #eee;
  border-radius: 8px;
  border: 1px solid lightgrey;
  display: flex;
  flex-direction: column;
  margin: 8px 0;
  padding: 16px;
`
