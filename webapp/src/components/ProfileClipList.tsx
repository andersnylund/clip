import React, { FC } from 'react'
import { Clip as ClipType } from '../../../shared/types'
import { SortableTree } from './Tree/SortableTree'
import { TreeItems } from './Tree/types'

export const ProfileClipList: FC<{ clips: ClipType[] }> = ({ clips }) => {
  const mapClipsToItems = (clips: ClipType[]): TreeItems => {
    return clips.map((clip) => ({
      children: mapClipsToItems(clip.clips),
      collapsed: clip.collapsed,
      id: clip.id,
      parentId: clip.parentId,
      title: clip.title,
      url: clip.url,
    }))
  }

  const items = mapClipsToItems(clips)

  return (
    <div className="max-w-7xl">
      <SortableTree initialItems={items} />
    </div>
  )
}
