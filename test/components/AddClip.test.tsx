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
      fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'url' } })
      fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'name' } })
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL')).toHaveValue('url')
      expect(screen.getByPlaceholderText('Name')).toHaveValue('name')
    })

    act(() => {
      fireEvent.click(screen.getByText(/Add/))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: '{"folderId":"id","url":"url","name":"name","userId":1}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('URL')).toHaveValue('')
    })
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })

  it('shows add button only when url has a value', async () => {
    render(
      <AddClip
        folder={{ id: 'id', name: 'name', clips: [] }}
        profile={{ id: 1, clips: [], folders: [], image: 'image', name: 'name', username: 'username' }}
      />
    )

    expect(screen.getByText(/Add/).parentElement).toHaveStyleRule('visibility', 'hidden')

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'url' } })
    })

    await waitFor(() => {
      expect(screen.getByText(/Add/).parentElement).toHaveStyleRule('visibility', 'initial')
    })
  })
})
