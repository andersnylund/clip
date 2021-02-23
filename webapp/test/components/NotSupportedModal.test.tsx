import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { NotSupportedModal } from '../../src/components/NotSupportedModal'
import ReactModal from 'react-modal'

describe('<NotSupportedModal />', () => {
  beforeAll(() => {
    ReactModal.setAppElement('body')
  })

  it('renders an open modal', () => {
    const mockSetIsInvalidBrowser = jest.fn()
    render(<NotSupportedModal setIsInvalidBrowser={mockSetIsInvalidBrowser} isInvalidBrowser={true} />)

    expect(screen.getByText(/Only Firefox and Chrome are currently supported/)).toBeInTheDocument()
  })

  it('does not render an open modal', () => {
    const mockSetIsInvalidBrowser = jest.fn()
    render(<NotSupportedModal setIsInvalidBrowser={mockSetIsInvalidBrowser} isInvalidBrowser={false} />)

    expect(screen.queryByText(/Only Firefox and Chrome are currently supported/)).not.toBeInTheDocument()
  })

  it('calls closing the modal when clicking close', () => {
    const mockSetIsInvalidBrowser = jest.fn()
    render(<NotSupportedModal setIsInvalidBrowser={mockSetIsInvalidBrowser} isInvalidBrowser={true} />)

    fireEvent.click(screen.getByText('Close'))

    expect(mockSetIsInvalidBrowser).toHaveBeenCalled()
  })
})
