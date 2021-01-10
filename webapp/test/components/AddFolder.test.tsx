import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { AddFolder } from '../../src/components/AddFolder'
import { useSignin } from '../../src/hooks/useSignin'

jest.mock('../../src/hooks/useSignin', () => ({
  useSignin: jest.fn(),
}))

describe('<AddFolder />', () => {
  it('calls useSignin on render', () => {
    render(<AddFolder />)
    expect(useSignin).toHaveBeenCalled()
  })

  it('inputs value', async () => {
    render(<AddFolder />)
    act(() => {
      fireEvent.change(screen.getByPlaceholderText('Folder name'), { target: { value: 'hello' } })
    })

    act(() => {
      fireEvent.click(screen.getByText('Add folder'))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/folder', {
        body: '{"name":"hello"}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
    })
  })
})
