import { fireEvent, render, screen } from '@testing-library/react'

import { ProfileClipList } from '../../src/components/ProfileClipList'
import { Clip } from '../../src/types'

const mockClips: Clip[] = [
  { id: 'clipId1', parentId: null, title: 'clip1', url: 'url1', index: 1, clips: [], userId: 0 },
  { id: 'clipId2', parentId: null, title: 'clip2', url: 'url2', index: 2, clips: [], userId: 0 },
]

describe('<ProfileClipList />', () => {
  it('renders two clips', () => {
    render(<ProfileClipList clips={mockClips} />)
    expect(screen.getByText('clip1'))
    expect(screen.getByText('clip2'))
  })

  it('deletes a clip', () => {
    render(<ProfileClipList clips={mockClips} />)
    const button = screen.getByText('clip1').nextSibling

    if (!button) {
      fail('no delete button found')
    }

    fireEvent.click(button)

    expect(fetch).toHaveBeenCalledWith('/api/clip/clipId1', { method: 'DELETE' })
  })
})
