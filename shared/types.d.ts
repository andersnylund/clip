export interface User {
  id: number
  image: string | null
  name: string | null
  clips: Clip[]
  username: string | null
}

export interface Clip {
  browserIds: string[]
  clips: Clip[]
  collapsed: boolean
  id: string
  index: number | null
  parentId: string | null
  title: string
  url: string | null
  userId: number
}
