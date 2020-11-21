import { render, screen } from '@testing-library/react'
import { makeDnd, DND_DRAGGABLE_DATA_ATTR, DND_DIRECTION_DOWN } from 'react-beautiful-dnd-test-utils'
import { mutate } from 'swr'

import { ProfileFolderList } from '../../src/components/ProfileFolderList'
import { useProfile } from '../../src/hooks/useProfile'
import { Clip, Folder, User } from '../../src/types'

const mockClips: Clip[] = [
  { id: 'clipId1', folderId: 'folderId1', name: 'clip1', url: 'url1', orderIndex: 1 },
  { id: 'clipId2', folderId: 'folderId1', name: 'clip2', url: 'url2', orderIndex: 2 },
]

const mockFolder1: Folder = {
  clips: mockClips,
  id: 'folderId1',
  name: 'folderName1',
}
const mockFolder2: Folder = {
  clips: [],
  id: 'folderId2',
  name: 'folderName2',
}

const mockProfile: User = {
  folders: [mockFolder1, mockFolder2],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(() => ({ profile: mockProfile })),
  PROFILE_PATH: jest.requireActual('../../src/hooks/useProfile').PROFILE_PATH,
}))

jest.mock('swr', () => ({
  cache: {
    get: () => mockProfile,
  },
  mutate: jest.fn(),
}))

describe('<ProfileFolderList />', () => {
  beforeEach(() => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: mockProfile })
  })

  it('renders 2 folders', () => {
    render(<ProfileFolderList />)
    expect(screen.getByText('folderName1'))
    expect(screen.getByText('folderName2'))
  })

  it('handles reordering', async () => {
    render(<ProfileFolderList />)

    const makeGetDragEl = (text: string) => () => screen.getByText(text).closest(DND_DRAGGABLE_DATA_ATTR)

    await makeDnd({
      getByText: screen.getByText,
      getDragEl: makeGetDragEl('clip1'),
      direction: DND_DIRECTION_DOWN,
      positions: 2,
    })

    expect(mutate).toHaveBeenNthCalledWith(
      1,
      '/api/profile',
      {
        folders: [
          {
            clips: [
              { folderId: 'folderId1', id: 'clipId2', name: 'clip2', orderIndex: 2, url: 'url2' },
              { folderId: 'folderId1', id: 'clipId1', name: 'clip1', orderIndex: 1, url: 'url1' },
            ],
            id: 'folderId1',
            name: 'folderName1',
          },
          { clips: [], id: 'folderId2', name: 'folderName2' },
        ],
        id: 1,
        image: 'image',
        name: 'name',
        username: 'username',
      },
      false
    )
    expect(fetch).toHaveBeenNthCalledWith(1, '/api/clip/clipId1', {
      body: '{"orderIndex":1,"folderId":"folderId1"}',
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    })
  })
})
