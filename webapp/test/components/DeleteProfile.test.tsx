import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import ReactModal from 'react-modal'
import { DeleteProfile } from '../../src/components/DeleteProfile'
import { User } from '../../../shared/types'
import jestFetchMock from 'jest-fetch-mock'
import Router from 'next/router'

jest.mock('next/router', () => ({
  __esModule: true,
  default: {
    push: jest.fn(),
    reload: jest.fn(),
  },
}))

const mockProfile: User = {
  clips: [],
  id: 1,
  image: '',
  name: '',
  username: '',
}

describe('<DeleteProfile />', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
    jestFetchMock.enableMocks()
  })

  it('doesnt render anything without profile', () => {
    const { container } = render(<DeleteProfile />)
    expect(container).toBeEmptyDOMElement()
  })

  it('does render the delete modal when clicking delete and closes it when clicking no', async () => {
    render(<DeleteProfile profile={mockProfile} />)

    const deleteButton = screen.getByText('Delete your profile')
    expect(deleteButton).toHaveClass('bg-red-700')

    act(() => {
      fireEvent.click(deleteButton)
    })

    await waitFor(() => {
      screen.getByText(/Are you sure you want to delete your profile?/)
    })

    act(() => {
      fireEvent.click(screen.getByText('No'))
    })

    await waitFor(() => {
      expect(screen.queryByText(/Are you sure you want to delete your profile?/)).not.toBeInTheDocument()
    })
  })

  it('calls delete api when clicking yes', async () => {
    render(<DeleteProfile profile={mockProfile} />)

    const deleteButton = screen.getByText('Delete your profile')

    act(() => {
      fireEvent.click(deleteButton)
    })

    await waitFor(() => {
      screen.getByText(/Are you sure you want to delete your profile?/)
    })

    act(() => {
      fireEvent.click(screen.getByText('Yes'))
    })

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/profile', { method: 'DELETE' })
      expect(Router.push).toHaveBeenCalledWith('/')
      expect(Router.reload).toHaveBeenCalled()
    })
  })
})
