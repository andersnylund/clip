import { screen, render } from '@testing-library/react'
import React from 'react'
import { Collapse } from '../../../src/components/Item/Collapse'

describe('<Collapse />', () => {
  it('rotates the chevron', () => {
    render(<Collapse collapsed={false} onClick={jest.fn()} />)
    expect(screen.getByTitle('Toggle collapse')).toHaveClass('rotate-90')
  })

  it('does not rotate the chevron', () => {
    render(<Collapse collapsed={true} onClick={jest.fn()} />)
    expect(screen.getByTitle('Toggle collapse')).not.toHaveClass('rotate-90')
  })
})
