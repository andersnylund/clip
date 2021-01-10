import { render } from '@testing-library/react'

import { GlobalStyles } from '../src/GlobalStyles'

describe('GlobalStyles', () => {
  it('renders', () => {
    const { container } = render(<GlobalStyles />)
    expect(container).toMatchInlineSnapshot(`<div />`)
  })
})
