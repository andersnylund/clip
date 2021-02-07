export interface User {
  id: number
  image: string | null
  name: string | null
  clips: Clip[]
  username: string | null
}

export interface Clip {
  id: string
  title: string
  parentId: string | null
  url: string | null
  index: number | null
  clips: Clip[]
}
