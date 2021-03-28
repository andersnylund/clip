import { arrayMove } from '@dnd-kit/sortable'
import type { FlattenedItem, TreeItem, TreeItems } from './types'

export const iOS = (): boolean => process.browser && /iPad|iPhone|iPod/.test(navigator.platform)

function getDragDepth(offset: number, indentationWidth: number) {
  return Math.round(offset / indentationWidth)
}

export const getProjection = (
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number
): { depth: number; maxDepth: number; minDepth: number; parentId: string | null } => {
  const overItemIndex = items.findIndex(({ id }) => id === overId)
  const activeItemIndex = items.findIndex(({ id }) => id === activeId)
  const activeItem = items[activeItemIndex]
  const newItems = arrayMove(items, activeItemIndex, overItemIndex)
  const previousItem = newItems[overItemIndex - 1]
  const nextItem = newItems[overItemIndex + 1]
  const dragDepth = getDragDepth(dragOffset, indentationWidth)
  const projectedDepth = activeItem.depth + dragDepth
  const maxDepth = getMaxDepth({
    previousItem,
  })
  const minDepth = getMinDepth({ nextItem })
  let depth = projectedDepth

  if (projectedDepth >= maxDepth) {
    depth = maxDepth
  } else if (projectedDepth < minDepth) {
    depth = minDepth
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() }

  function getParentId() {
    if (depth === 0 || !previousItem) {
      return null
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId
    }

    if (depth > previousItem.depth) {
      return previousItem.id
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId

    return newParent ?? null
  }
}

function getMaxDepth({ previousItem }: { previousItem: FlattenedItem }) {
  if (previousItem) {
    return previousItem.depth + 1
  }

  return 0
}

function getMinDepth({ nextItem }: { nextItem: FlattenedItem }) {
  if (nextItem) {
    return nextItem.depth
  }

  return 0
}

function flatten(items: TreeItems, parentId: string | null = null, depth = 0): FlattenedItem[] {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    return [...acc, { ...item, parentId, depth, index }, ...flatten(item.children, item.id, depth + 1)]
  }, [])
}

export function flattenTree(items: TreeItems): FlattenedItem[] {
  return flatten(items)
}

export function buildTree(flattenedItems: FlattenedItem[]): TreeItems {
  const root: TreeItem = { id: 'root', children: [], title: 'title' }
  const nodes: Record<string, TreeItem> = { [root.id]: root }
  const items = flattenedItems.map((item) => ({ ...item, children: [] }))

  for (const item of items) {
    const { id, children, title, url } = item
    const parentId = item.parentId ?? root.id
    const parent = nodes[parentId] ?? findItem(items, parentId)

    nodes[id] = { id, title, url, children }
    parent.children.push(item)
  }

  return root.children
}

export const findItem = (items: TreeItem[], itemId: string): TreeItem | undefined => {
  return items.find(({ id }) => id === itemId)
}

export const findItemDeep = (items: TreeItems, itemId: string): TreeItem | undefined => {
  for (const item of items) {
    const { id, children } = item

    if (id === itemId) {
      return item
    }

    if (children.length) {
      const child = findItemDeep(children, itemId)

      if (child) {
        return child
      }
    }
  }

  return undefined
}

export const removeItem = (items: TreeItems, id: string): TreeItem[] => {
  const newItems = []

  for (const item of items) {
    if (item.id === id) {
      continue
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id)
    }

    newItems.push(item)
  }

  return newItems
}

export const setProperty = <T extends keyof TreeItem>(
  items: TreeItems,
  id: string,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T]
): TreeItem[] => {
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property])
      continue
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter)
    }
  }

  return [...items]
}

function countChildren(items: TreeItem[], count = 0): number {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1)
    }

    return acc + 1
  }, count)
}

export const getChildCount = (items: TreeItems, id: string): number => {
  if (!id) {
    return 0
  }

  const item = findItemDeep(items, id)
  return item ? countChildren(item.children) : 0
}

export const removeChildrenOf = (items: FlattenedItem[], ids: string[]): FlattenedItem[] => {
  const excludeParentIds = [...ids]

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id)
      }
      return false
    }

    return true
  })
}
