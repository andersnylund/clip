import { render, screen } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { mocked } from 'ts-jest/utils'
import { ProfileClipList } from '../../src/components/ProfileClipList'
import { Clip } from '../../src/types'

const mockClips: Clip[] = [
  {
    id: 'folderId1',
    parentId: null,
    title: 'folderTitle1',
    url: null,
    index: 1,
    clips: [
      { id: 'clipId1', parentId: null, title: 'clip1', url: 'url1', index: 1, clips: [], userId: 0, collapsed: true },
    ],
    userId: 0,
    collapsed: true,
  },
  { id: 'clipId2', parentId: null, title: 'clip2', url: 'url2', index: 2, clips: [], userId: 0, collapsed: true },
]

describe('<ProfileClipList />', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(() => {
    const mockFetch = mocked(fetch)
    mockFetch.mockClear()
  })

  it('renders one "folder" and another clip', () => {
    render(<ProfileClipList clips={mockClips} />)
    expect(screen.getByText('folderTitle1'))
    expect(screen.getByText('clip2'))
  })
})
