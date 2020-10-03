import { fireEvent, render, screen } from '@testing-library/react'

import { ProfileClipList } from '../../src/components/ProfileClipList'
import { Clip } from '../../src/types'

const mockClips: Clip[] = [
  { id: 'id1', folderId: 'folderId1', name: 'name1', url: 'url1', userId: 1 },
  { id: 'id2', folderId: 'folderId2', name: 'name2', url: 'url2', userId: 2 },
]

describe('<ProfileClipList />', () => {
  it('renders two clips', () => {
    render(<ProfileClipList clips={mockClips} />)
    expect(screen.getByText('name1').closest('a')).toHaveAttribute('href', 'url1')
    expect(screen.getByText('name2').closest('a')).toHaveAttribute('href', 'url2')
  })

  it('deletes a clip', () => {
    render(<ProfileClipList clips={mockClips} />)
    const button = screen.getByText('name1').nextSibling

    if (!button) {
      fail('no delete button found')
    }

    fireEvent.click(button)

    expect(fetch).toHaveBeenCalledWith('/api/clip/id1', { method: 'DELETE' })
  })
})
