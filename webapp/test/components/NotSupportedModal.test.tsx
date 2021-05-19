import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import ReactModal from 'react-modal'
import { NotSupportedModal } from '../../src/components/NotSupportedModal'

describe('<NotSupportedModal />', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
  })

  it('renders an open modal', () => {
    const mockOnClose = jest.fn()
    render(<NotSupportedModal onClose={mockOnClose} isInvalidBrowser={true} />)

    expect(screen.getByText(/Only Firefox, Chrome and Brave are currently supported/)).toBeInTheDocument()
  })

  it('does not render an open modal', () => {
    const mockOnClose = jest.fn()
    render(<NotSupportedModal onClose={mockOnClose} isInvalidBrowser={false} />)

    expect(screen.queryByText(/Only Firefox, Chrome and Brave are currently supported/)).not.toBeInTheDocument()
  })

  it('calls closing the modal when clicking close', () => {
    const mockOnClose = jest.fn()
    render(<NotSupportedModal onClose={mockOnClose} isInvalidBrowser={true} />)

    fireEvent.click(screen.getByText('Close'))

    expect(mockOnClose).toHaveBeenCalled()
  })
})
