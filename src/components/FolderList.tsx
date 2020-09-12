import React, { FC } from 'react'
import styled from 'styled-components'

export const FolderList: FC<{ folders: { id: string; name: string }[] }> = ({ folders }) => (
  <List>
    {folders.map((folder) => (
      <Folder key={folder.id}>{folder.name}</Folder>
    ))}
  </List>
)

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`

const Folder = styled.li`
  border-radius: 8px;
  border: 1px solid grey;
  padding: 16px;
`
