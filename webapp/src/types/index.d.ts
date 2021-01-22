export interface User {
  id: number
  image: string | null
  name: string | null
  nodes: Node[]
  username: string | null
}

export interface Node {
  id: string
  title: string
  url: string | null
  index: number | null
  children?: Node[]
}
