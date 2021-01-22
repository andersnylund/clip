import React, { FC } from 'react'
import styled from 'styled-components'

import { Node as NodeType } from '../types'

interface Props {
  nodes: NodeType[]
}

export const Nodes: FC<Props> = ({ nodes }) => {
  return (
    <List>
      {nodes.map((node) => (
        <Node key={node.id} node={node} />
      ))}
    </List>
  )
}

const Node: FC<{ node: NodeType }> = ({ node }) => (
  <FolderItem>
    <h2>{node.title}</h2>
    <ClipList>
      {node.children.map((node) => (
        <ClipItem key={node.id}>
          <a href={node.url || ''}>{node.title}</a>
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
