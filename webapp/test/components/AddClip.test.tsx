import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { mutate } from 'swr'
import { mocked } from 'ts-jest/utils'
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
      fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'https://url' } })
      fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'title' } })
    })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL')).toHaveValue('https://url')
      expect(screen.getByPlaceholderText('Title')).toHaveValue('title')
    })

    act(() => {
      fireEvent.click(screen.getByText(/Add/))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: expect.anything(),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('URL')).toHaveValue('')
    })
    const receivedBody = JSON.parse(mocked(fetch).mock.calls[0][1]?.body?.toString() ?? '')
    expect(receivedBody).toEqual({ clips: [], index: null, title: 'title', url: 'https://url' })
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

  it('does not allow to submit an empty title', async () => {
    render(<AddClip />)
    fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'https://url' } })
    fireEvent.click(screen.getByText(/Add/))

    expect((await screen.findByRole('alert')).textContent).toEqual('Title is required')
  })

  it('does not allow to submit an invalid url', async () => {
    render(<AddClip />)
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Title' } })
    fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'invalid url' } })
    fireEvent.click(screen.getByText(/Add/))

    expect((await screen.findByRole('alert')).textContent).toEqual('Invalid url')
  })
})
