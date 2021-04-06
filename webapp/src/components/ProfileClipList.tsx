import React, { FC } from 'react'
import { Clip as ClipType } from '../types'
import { SortableTree } from './Tree/SortableTree'
import { TreeItems } from './Tree/types'

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
