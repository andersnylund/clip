import React, { FC } from 'react'
import styled from 'styled-components'

import { Folder } from '../types'

export const FolderList: FC<{ folders: Folder[] }> = ({ folders }) => (
  <List>
    {folders.map((folder) => (
      <FolderItem key={folder.id}>
        <h2>{folder.name}</h2>
        <ClipList>
          {folder.clips.map((clip) => (
            <ClipItem key={clip.id}>
              <a href={clip.url}>{clip.name}</a>
            </ClipItem>
          ))}
        </ClipList>
      </FolderItem>
    ))}
  </List>
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
