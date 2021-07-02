import React, { FC } from 'react'
import styled from 'styled-components'

import { Clip as ClipType } from '../../../shared/types'

interface Props {
  clips: ClipType[]
}

export const Clips: FC<Props> = ({ clips }) => {
  return (
    <List>
      {clips.map((clip) => (
        <Clip key={clip.id} clip={clip} />
      ))}
    </List>
  )
}

const Clip: FC<{ clip: ClipType }> = ({ clip }) => {
  if (clip.url) {
    return (
      <ClipItem key={clip.id}>
        <a href={clip.url}>{clip.title}</a>
      </ClipItem>
    )
  }
  return (
    <FolderItem>
      <h2>{clip.title}</h2>
      <ClipList>
        {clip.clips.map((clip) => (
          <Clip key={clip.id} clip={clip} />
        ))}
      </ClipList>
    </FolderItem>
  )
}

const List = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  list-style-type: none;
  margin: 2rem 0;
  max-width: 1200px;
  padding: 0;
  width: 100%;

  h2 {
    margin: 8px 0;
    padding: 0;
  }
`

const FolderItem = styled.div`
  border-radius: 8px;
  border: 1px solid lightgrey;
  padding: 16px;
`

const ClipList = styled.div`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const ClipItem = styled.div`
  padding: 4px;

  a {
    color: black;
    text-decoration: none;
  }
`
