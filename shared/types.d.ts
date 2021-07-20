export interface User {
  id: number
  image: string | null
  name: string | null
  clips: Clip[]
  username: string | null
  syncEnabled: boolean
  syncId: string | null
}

export interface Clip {
  clips: Clip[]
  id: string
  index: number | null
  parentId: string | null
  title: string
  url: string | null
  userId: number
  collapsed: boolean
}
