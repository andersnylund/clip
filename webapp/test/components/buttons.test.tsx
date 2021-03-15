import { render, screen } from '@testing-library/react'
import { Button, LinkButton } from '../../src/components/buttons'

describe('buttons', () => {
  it('renders secondary button by default', () => {
    render(<Button>text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'white')
  })

  it('renders primary color', () => {
    render(<Button color="primary">text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'orange')
  })

  it('renders warning button', () => {
    render(<Button color="warning">text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', '#FFC900')
  })

  it('renders danger button', () => {
    render(<Button color="danger">text</Button>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'red')
  })

  it('renders button without color', () => {
    render(<Button>text</Button>)
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
    render(<LinkButton color="primary">text</LinkButton>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'orange')
  })

  it('renders secondary LinkButton', () => {
    render(<LinkButton>text</LinkButton>)
    expect(screen.getByText('text')).toHaveStyleRule('background-color', 'white')
  })
})
