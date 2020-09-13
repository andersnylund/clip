import React, { FC } from 'react'
import styled from 'styled-components'

import { Folder } from '../types'

export const FolderList: FC<{ folders: Folder[] }> = ({ folders }) => (
  <List>
    {folders.map((folder) => (
      <FolderItem key={folder.id}>{folder.name}</FolderItem>
    ))}
  </List>
)

const List = styled.ul`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  list-style-type: none;
  margin: 2rem 0;
  padding: 0;
  width: 100%;
`

const FolderItem = styled.li`
  border-radius: 8px;
  border: 1px solid lightgrey;
  padding: 16px;
`
