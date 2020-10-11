import { render, screen } from '@testing-library/react'

import { ProfileFolderList } from '../../src/components/ProfileFolderList'
import { useProfile } from '../../src/hooks/useProfile'
import { User } from '../../src/types'

const mockProfile: User = {
  clips: [],
  folders: [
    { id: 'id1', name: 'name1', clips: [] },
    { id: 'id2', name: 'name2', clips: [] },
  ],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(() => ({ profile: mockProfile })),
}))

describe('<ProfileFolderList />', () => {
  it('renders 2 folders', () => {
    render(<ProfileFolderList />)
    expect(screen.getByText('name1'))
    expect(screen.getByText('name2'))
  })

  it('renders uncategorized clips', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({
      profile: {
        ...mockProfile,
        clips: [
          {
            folderId: null,
            id: 'uncategorizedClipId',
            name: 'uncategorizedClipName',
            url: 'uncategorizedClipUrl',
            userId: 1,
          },
        ],
      } as User,
    })

    render(<ProfileFolderList />)
    expect(screen.getByText('Uncategorized'))
    expect(screen.getByText('uncategorizedClipName'))
  })
})
