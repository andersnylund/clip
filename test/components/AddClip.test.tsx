import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'

import { AddClip } from '../../src/components/AddClip'
import { PROFILE_PATH } from '../../src/hooks/useProfile'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

describe('<AddClip />', () => {
  it('changes input value and submits a new clip', async () => {
    render(
      <AddClip
        folder={{ id: 'id', name: 'name', clips: [] }}
        profile={{ id: 1, clips: [], folders: [], image: 'image', name: 'name', username: 'username' }}
      />
    )

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Clip url'), { target: { value: 'url' } })
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Clip url')).toHaveValue('url')
    })

    act(() => {
      fireEvent.click(screen.getByLabelText('clip'))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: '{"folderId":"id","name":"url","url":"url","userId":1}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('Clip url')).toHaveValue('')
    })
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })
})
