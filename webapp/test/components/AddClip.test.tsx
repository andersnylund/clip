import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import jestFetchMock from 'jest-fetch-mock'
import { mutate } from 'swr'
import { mocked } from 'ts-jest/utils'
import { PROFILE_PATH } from '../../../shared/hooks/useProfile'
import { AddClip } from '../../src/components/AddClip'

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

describe('<AddClip />', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(jestFetchMock.resetMocks)

  it('changes input value and submits a new clip', async () => {
    render(<AddClip />)

    fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'https://url' } })
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'title' } })
    expect(screen.getByPlaceholderText('URL')).toHaveValue('https://url')
    expect(screen.getByPlaceholderText('Title')).toHaveValue('title')

    fireEvent.click(screen.getByText(/Add/))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: expect.anything(),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      expect(screen.getByPlaceholderText('URL')).toHaveValue('')
    })
    const receivedBody = JSON.parse(mocked(fetch).mock.calls[0][1]?.body?.toString() ?? '')
    expect(receivedBody).toEqual({ title: 'title', url: 'https://url' })
    await waitFor(() => {
      expect(mutate).toHaveBeenCalledWith(PROFILE_PATH)
    })
  })

  it('shows different text on add button based on if URL field has a value or not', async () => {
    render(<AddClip />)
    expect(screen.getByText('Add folder')).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'url' } })
    await waitFor(() => {
      expect(screen.getByPlaceholderText('URL')).toHaveValue('url')
      expect(screen.getByText('Add clip')).toBeInTheDocument()
    })
  })

  it('sends an empty url as null', async () => {
    render(<AddClip />)
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Clip without url' } })
    fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: '' } })

    fireEvent.click(screen.getByText(/Add/))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/clip', {
        body: expect.anything(),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      const receivedBody = JSON.parse(mocked(fetch).mock.calls[0][1]?.body?.toString() ?? '')
      expect(receivedBody).toEqual({ title: 'Clip without url', url: null })
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

    expect(await screen.findByRole('alert')).toHaveTextContent('Title is required')
  })

  it('does not allow to submit an invalid url', async () => {
    render(<AddClip />)
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Title' } })
    fireEvent.change(screen.getByPlaceholderText('URL'), { target: { value: 'invalid url' } })
    fireEvent.click(screen.getByText(/Add/))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid url')
  })
})
