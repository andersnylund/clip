import { render, screen } from '@testing-library/react'

import { ProfileFolderList } from '../../src/components/ProfileFolderList'
import { Folder } from '../../src/types'

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(() => ({ profile: {} })),
}))

const mockFolders: Folder[] = [
  { id: 'id1', name: 'name1', clips: [] },
  { id: 'id2', name: 'name2', clips: [] },
]

describe('<ProfileFolderList />', () => {
  it('renders 2 folders', () => {
    render(<ProfileFolderList folders={mockFolders} />)
    expect(screen.getByText('name1'))
    expect(screen.getByText('name2'))
  })
})
