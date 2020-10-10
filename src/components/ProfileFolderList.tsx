import React, { FC } from 'react'
import styled from 'styled-components'

import { Folder } from '../types'
import { ProfileFolder } from './ProfileFolder'

export const ProfileFolderList: FC<{ folders: Folder[] }> = ({ folders }) => (
  <List>
    {folders.map((folder) => (
      <ProfileFolder key={folder.id} folder={folder} />
    ))}
  </List>
)

const List = styled.ul`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  list-style-type: none;
  margin: 2rem 0;
  max-width: 1200px;
  padding: 0;
  width: 100%;
`
