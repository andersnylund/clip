import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { mutate } from 'swr'

import { AddClip } from '../../src/components/AddClip'
import { PROFILE_PATH } from '../../src/hooks/useProfile'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

describe('<AddClip />', () => {
  it('changes input value and submits a new clip', async () => {
    render(<AddClip />)

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'url' } })
      fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'title' } })
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL')).toHaveValue('url')
      expect(screen.getByPlaceholderText('Title')).toHaveValue('title')
    })

    act(() => {
      fireEvent.click(screen.getByText(/Add/))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: '{"clips":[],"index":null,"title":"title","url":"url"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('URL')).toHaveValue('')
    })
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })

  it('shows add different text based on if URL has a value or not', async () => {
    render(<AddClip />)
    expect(screen.getByText('Add folder')).toBeInTheDocument()

    act(() => {
      fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'url' } })
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL')).toHaveValue('url')
      expect(screen.getByText('Add clip')).toBeInTheDocument()
    })
  })
})
