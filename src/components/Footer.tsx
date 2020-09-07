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
    by Anders Nylund
  </Container>
)

const Container = styled.footer`
  margin: 16px;
  text-align: center;
`
