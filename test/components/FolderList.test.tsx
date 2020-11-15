import { render, screen } from '@testing-library/react'

import { FolderList } from '../../src/components/FolderList'
import { Clip, Folder, User } from '../../src/types'

const mockFolders: Folder[] = [
  {
    id: 'folderId',
    name: 'folderName',
    clips: [{ id: 'clipId', name: 'clipName', folderId: 'folderId', url: 'clipUrl', userId: 1, orderIndex: 0 }],
  },
]

const mockClips: Clip[] = [
  mockFolders[0].clips[0],
  { folderId: null, id: 'noFolderClipId', name: 'noFolderClipName', url: 'noFolderClipUrl', userId: 1, orderIndex: 0 },
]

const mockUser: User = {
  clips: mockClips,
  folders: mockFolders,
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

describe('<FolderList />', () => {
  it('renders folder and clip', () => {
    render(<FolderList clips={[]} folders={mockUser.folders} />)
    expect(screen.getByText('clipName')).toHaveAttribute('href', 'clipUrl')
    expect(screen.getByText('folderName'))
  })

  it('renders an uncategorized clip', () => {
    render(<FolderList clips={mockUser.clips} folders={mockUser.folders} />)
    expect(screen.getByText('Uncategorized'))
    expect(screen.getByText('noFolderClipName')).toHaveAttribute('href', 'noFolderClipUrl')
  })
})
