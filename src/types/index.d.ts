export interface User {
  clips: Clip[]
  folders: Folder[]
  id: number
  image: string | null
  name: string | null
  username: string | null
}

export interface Folder {
  id: string
  name: string
}

export interface Clip {
  id: string
  name: string
}
