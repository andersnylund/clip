import React, { FC } from 'react'
import styled from 'styled-components'

import { useProfile } from '../hooks/useProfile'
import { ProfileFolder } from './ProfileFolder'

export const ProfileFolderList: FC = () => {
  const { profile } = useProfile()

  const uncategorizedClips = profile?.clips.filter((clip) => !clip.folderId)

  return (
    <List>
      {profile?.folders.map((folder) => (
        <ProfileFolder key={folder.id} folder={folder} />
      ))}
      {uncategorizedClips && uncategorizedClips.length > 0 && (
        <ProfileFolder folder={{ id: 'uncategorized', clips: uncategorizedClips, name: 'Uncategorized' }} />
      )}
    </List>
  )
}

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
