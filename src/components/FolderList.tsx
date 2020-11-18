import React, { FC } from 'react'
import styled from 'styled-components'

import { Folder as FolderType } from '../types'

interface Props {
  folders: FolderType[]
}

export const FolderList: FC<Props> = ({ folders }) => {
  return (
    <List>
      {folders.map((folder) => (
        <Folder key={folder.id} folder={folder} />
      ))}
    </List>
  )
}

const Folder: FC<{ folder: FolderType }> = ({ folder }) => (
  <FolderItem>
    <h2>{folder.name}</h2>
    <ClipList>
      {folder.clips.map((clip) => (
        <ClipItem key={clip.id}>
          <a href={clip.url}>{clip.name}</a>
        </ClipItem>
      ))}
    </ClipList>
  </FolderItem>
)

const List = styled.ul`
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

const FolderItem = styled.li`
  border-radius: 8px;
  border: 1px solid lightgrey;
  padding: 16px;
`

const ClipList = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const ClipItem = styled.li`
  padding: 4px;

  a {
    color: black;
    text-decoration: none;
  }
`
