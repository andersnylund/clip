import { render, screen } from '@testing-library/react'

import { Clips } from '../../src/components/Clips'
import { Folder, User } from '../../src/types'

const mockFolders: Folder[] = [
  {
    id: 'folderId',
    name: 'folderName',
    clips: [{ id: 'clipId', name: 'clipName', folderId: 'folderId', url: 'clipUrl', orderIndex: 0 }],
  },
]

const mockUser: User = {
  folders: mockFolders,
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

describe('<FolderList />', () => {
  it('renders folder and clip', () => {
    render(<Clips clips={mockUser.folders} />)
    expect(screen.getByText('clipName')).toHaveAttribute('href', 'clipUrl')
    expect(screen.getByText('folderName'))
  })
})
