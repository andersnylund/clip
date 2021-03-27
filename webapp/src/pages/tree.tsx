import React, { FC } from 'react'
import { Layout } from '../components/Layout'
import { SortableTree } from '../components/Tree/SortableTree'
import { TreeItems } from '../components/Tree/types'
import { useProfile } from '../hooks/useProfile'
import { Clip } from '../types'

const Tree: FC = () => {
  const { profile, isLoading } = useProfile()

  const mapClipsToItems = (clips?: Clip[]): TreeItems => {
    if (!clips) {
      return []
    }
    return clips.map((clip) => ({
      id: clip.title,
      children: mapClipsToItems(clip.clips),
      collapsed: true,
    }))
  }

  const mappedClips = mapClipsToItems(profile?.clips)
  const items = mappedClips.length > 0 ? mappedClips : undefined

  return isLoading ? (
    <div>Loading</div>
  ) : (
    <Layout>
      <div className="max-w-7xl">
        <SortableTree collapsible indicator removable indentationWidth={15} defaultItems={items} />
      </div>
    </Layout>
  )
}

export default Tree
