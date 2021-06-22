import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { mutate } from 'swr'
import { AddClip } from '../../src/components/AddClip'
import { PROFILE_PATH } from '../../src/hooks/useProfile'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

describe('<AddClip />', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(jestFetchMock.resetMocks)

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

  it('shows different text on add button based on if URL field has a value or not', async () => {
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

  it('sends an empty url as null', async () => {
    render(<AddClip />)
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Clip without url' } })
      fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: '' } })
    })

    act(() => {
      fireEvent.click(screen.getByText(/Add/))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: JSON.stringify({ clips: [], index: null, title: 'Clip without url', url: null }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('URL')).toHaveValue('')
    })
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })
})
