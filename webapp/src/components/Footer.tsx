import React, { FC } from 'react'
import styled from 'styled-components'

export const Footer: FC = () => (
  <Container>
    Made with{' '}
    <span role="img" aria-label="coffee">
      ☕️
    </span>{' '}
    &{' '}
    <span role="img" aria-label="sleep">
      😴
    </span>{' '}
    by <a href="https://github.com/andersnylund">Anders Nylund</a>
  </Container>
)

const Container = styled.footer`
  margin: 16px;
  text-align: center;

  a {
    color: black;
  }
`
