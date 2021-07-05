import { render, screen } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { mocked } from 'ts-jest/utils'
import { ProfileClipList } from '../../src/components/ProfileClipList'
import { Clip } from '../../../shared/types'

const mockClips: Clip[] = [
  {
    browserIds: [],
    clips: [
      {
        browserIds: [],
        clips: [],
        collapsed: true,
        id: 'clipId1',
        index: 1,
        parentId: null,
        title: 'clip1',
        url: 'url1',
        userId: 0,
      },
    ],
    id: 'folderId1',
    index: 1,
    parentId: null,
    title: 'folderTitle1',
    url: null,
    userId: 0,
    collapsed: true,
  },
  {
    browserIds: [],
    clips: [],
    collapsed: true,
    id: 'clipId2',
    index: 2,
    parentId: null,
    title: 'clip2',
    url: 'url2',
    userId: 0,
  },
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
