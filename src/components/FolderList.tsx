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
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const FolderItem = styled.li`
  border-radius: 8px;
  border: 1px solid grey;
  padding: 16px;
`
