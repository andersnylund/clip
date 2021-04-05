import { DragEndEvent } from '@dnd-kit/core'
import React, { FC } from 'react'
import { mutate } from 'swr'
import { PROFILE_PATH } from '../hooks/useProfile'
import { Clip as ClipType } from '../types'
import { SortableTree } from './Tree/SortableTree'
import { TreeItems } from './Tree/types'

export const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
  const { active, over } = event
  if (active.id !== over?.id) {
    await fetch(`/api/clip/${active.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        parentId: over?.id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    mutate(PROFILE_PATH)
  }
}

export const ProfileClipList: FC<{ clips: ClipType[] }> = ({ clips }) => {
  const mapClipsToItems = (clips?: ClipType[]): TreeItems => {
    if (!clips) {
      return []
    }
    return clips.map((clip) => ({
      id: clip.id,
      title: clip.title,
      url: clip.url,
      children: mapClipsToItems(clip.clips),
      collapsed: true,
    }))
  }

  const items = mapClipsToItems(clips)

  return (
    <div className="max-w-3xl">
      <SortableTree initialItems={items} />
    </div>
  )
}
