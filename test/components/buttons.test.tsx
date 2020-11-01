import { render, screen } from '@testing-library/react'

import { Button, LinkButton } from '../../src/components/buttons'

describe('buttons', () => {
  it('renders secondary button by default', () => {
    render(<Button>text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'white')
  })

  it('renders primary button', () => {
    render(<Button primary={true}>text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'orange')
  })

  it('renders secondary button', () => {
    render(<Button primary={false}>text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'white')
  })

  it('renders a disabled button', () => {
    render(<Button disabled={true}>text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'lightgrey')
  })

  it('renders secondary LinkButton by default', () => {
    render(<LinkButton>text</LinkButton>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'white')
  })

  it('renders primary LinkButton', () => {
    render(<LinkButton primary={true}>text</LinkButton>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'orange')
  })

  it('renders secondary LinkButton', () => {
    render(<LinkButton primary={false}>text</LinkButton>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'white')
  })
})
