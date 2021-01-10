import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { UsernameModal } from '../../src/components/UsernameModal'

describe('<UsernameModal />', () => {
  it('it defaults to an open modal', () => {
    render(<UsernameModal />)

    expect(screen.getByText(/Set an username for yourself/))
  })

  it('closes the modal on close click', () => {
    render(<UsernameModal />)

    fireEvent.click(screen.getByTitle('close'))

    expect(screen.queryByText(/Set an username for yourself/)).not.toBeInTheDocument()
  })
})
