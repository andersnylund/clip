import React, { FC } from 'react'
import styled from 'styled-components'

import { Clip } from '../types'

export const ProfileClipList: FC<{ clips: Clip[] }> = ({ clips }) => {
  return (
    <List>
      {clips.map((clip) => (
        <li key={clip.id}>
          <a href={clip.url}>{clip.name}</a>
        </li>
      ))}
    </List>
  )
}

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;

  li {
    background-color: white;
    border-radius: 4px;
    border: 1px solid #ddd;
    margin: 8px;
    padding: 8px;
    overflow: hidden;

    a {
      text-decoration: none;
      color: black;
    }
  }
`
