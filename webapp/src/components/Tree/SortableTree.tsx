import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  LayoutMeasuring,
  LayoutMeasuringStrategy,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../../hooks/useProfile'
import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates'
import { SortableTreeItem } from './SortableTreeItem'
import { TreeItem } from './TreeItem'
import type { FlattenedItem, SensorContext, TreeItems } from './types'
import {
  buildTree,
  flattenTree,
  getChildCount,
  getProjection,
  removeChildrenOf,
  removeItem,
  setProperty,
} from './utilities'

const layoutMeasuring: Partial<LayoutMeasuring> = {
  strategy: LayoutMeasuringStrategy.Always,
}

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
}

interface Props {
  initialItems: TreeItems
}

export const SortableTree: FC<Props> = ({ initialItems }) => {
  const indentationWidth = 15
  const [items, setItems] = useState(initialItems)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [offsetLeft, setOffsetLeft] = useState(0)

  useEffect(() => {
    setItems(initialItems)
  }, [initialItems])

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items)
    const collapsedItems = flattenedTree.reduce<string[]>(
      (acc, { children, collapsed, id }) => (collapsed && children.length ? [...acc, id] : acc),
      []
    )

    return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems)
  }, [activeId, items])

  const projected =
    activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth) : null

  const sensorContext: SensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  })

  const [coordinateGetter] = useState(() => sortableTreeKeyboardCoordinates(sensorContext, indentationWidth))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    })
  )

  const sortedIds = useMemo(() => flattenedItems.map(({ id }) => id), [flattenedItems])
  const activeItem = activeId ? flattenedItems.find(({ id }) => id === activeId) : null

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    }
  }, [flattenedItems, offsetLeft])

  return (
    <DndContext
      sensors={sensors}
      modifiers={[adjustTranslate]}
      collisionDetection={closestCenter}
      layoutMeasuring={layoutMeasuring}
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
        {flattenedItems.map(({ id, children, title, parentId, url, collapsed, depth }) => (
          <SortableTreeItem
            key={id}
            id={id}
            item={{ id, title, url, parentId }}
            depth={id === activeId && projected ? projected.depth : depth}
            indentationWidth={indentationWidth}
            collapsed={Boolean(collapsed && children.length)}
            onCollapse={children.length ? () => handleCollapse(id) : undefined}
            onRemove={() => handleRemove(id)}
          />
        ))}
        {process.browser &&
          createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeId && activeItem ? (
                <TreeItem
                  depth={activeItem.depth}
                  clone
                  childCount={getChildCount(items, activeId) + 1}
                  item={{
                    id: activeItem.id,
                    title: activeItem.title,
                    url: activeItem.url,
                    parentId: activeItem.parentId,
                  }}
                  indentationWidth={indentationWidth}
                />
              ) : null}
            </DragOverlay>,
            document.body
          )}
      </SortableContext>
    </DndContext>
  )

  function handleDragStart({ active: { id } }: DragStartEvent) {
    setActiveId(id)
    setOverId(id)

    document.body.style.setProperty('cursor', 'grabbing')
  }

  function handleDragMove({ delta }: DragMoveEvent) {
    setOffsetLeft(delta.x)
  }

  function handleDragOver({ over }: DragOverEvent) {
    setOverId(over?.id ?? null)
  }

  async function handleDragEnd({ active, over }: DragEndEvent) {
    resetState()

    if (projected && over) {
      const { depth, parentId } = projected
      const clonedItems: FlattenedItem[] = JSON.parse(JSON.stringify(flattenTree(items)))
      const overIndex = clonedItems.findIndex(({ id }) => id === over.id)
      const activeIndex = clonedItems.findIndex(({ id }) => id === active.id)
      const activeTreeItem = clonedItems[activeIndex]
      const overIndexInTree = items.findIndex(({ id }) => id === over.id)

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId }

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex)
      const newItems = buildTree(sortedItems)

      setItems(newItems)

      await updateClip({ active, parentId, index: overIndexInTree })
    }
  }

  function handleDragCancel() {
    resetState()
  }

  function resetState() {
    setOverId(null)
    setActiveId(null)
    setOffsetLeft(0)

    document.body.style.setProperty('cursor', '')
  }

  function handleRemove(id: string) {
    setItems((items) => removeItem(items, id))
  }

  function handleCollapse(id: string) {
    setItems((items) =>
      setProperty(items, id, 'collapsed', (value) => {
        return !value
      })
    )
  }
}

const adjustTranslate: Modifier = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  }
}

export const findIndex = (items: TreeItems, overId: string): number => {
  // TODO: is there a more elegant way?
  const index = items.findIndex(({ id }) => id === overId)
  if (index === -1) {
    return items.reduce((prev, curr) => {
      if (prev !== -1) {
        return prev
      } else {
        return findIndex(curr.children, overId)
      }
    }, -1)
  } else {
    return index
  }
}

export const updateClip = async ({
  active,
  parentId,
  index,
}: Pick<DragEndEvent, 'active'> & { parentId: string | null; index: number }): Promise<void> => {
  await fetch(`/api/clip/${active.id}`, {
    method: 'PUT',
    body: JSON.stringify({
      parentId,
      index,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await mutate(PROFILE_PATH)
}
