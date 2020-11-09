export interface User {
  clips: Clip[]
  folders: Folder[]
  id: number
  image: string | null
  name: string | null
  username: string | null
}

export interface Folder {
  clips: Clip[]
  id: string
  name: string
}

export interface Clip {
  folderId: string | null
  id: string
  name: string
  url: string
  userId: number
  orderIndex: number | null
}
