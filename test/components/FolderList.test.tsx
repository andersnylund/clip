import { render, screen } from '@testing-library/react'

import { FolderList } from '../../src/components/FolderList'

describe('<FolderList />', () => {
  it('renders a clip', () => {
    render(
      <FolderList
        folders={[
          {
            id: 'folderId',
            name: 'folderName',
            clips: [{ id: 'clipId', name: 'clipName', folderId: 'folderId', url: 'clipUrl', userId: 1 }],
          },
        ]}
      />
    )
    expect(screen.getByText('clipName')).toHaveAttribute('href', 'clipUrl')
  })
})
