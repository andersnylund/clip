import { MutableRefObject } from 'react'

export interface TreeItem {
  id: string
  title: string
  url: string | null
  parentId: string | null
  children: TreeItem[]
  collapsed?: boolean
}

export type TreeItems = TreeItem[]

export interface FlattenedItem extends TreeItem {
  parentId: null | string
  depth: number
  index: number
}

export type SensorContext = MutableRefObject<{
  items: FlattenedItem[]
  offset: number
}>
