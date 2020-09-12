export interface User {
  bookmarks: Bookmark[]
  email: string | null
  folders: Folder[]
  id: number
  image: string | null
  username: string | null
}

export interface Folder {
  id: string
  name: string
}

export interface Bookmark {
  id: string
  name: string
}
