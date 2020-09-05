import styled, { css } from 'styled-components'
import Link from 'next/link'

const buttonStyles = css`
  background-color: white;
  border: 0;
  padding: 8px;
  transition: 0.2s;
  border-radius: 4px;

  &:hover {
    background: lightgray;
    cursor: pointer;
  }
`

export const Button = styled.button`
  ${buttonStyles}
`

export const LinkButton = styled.a`
  ${buttonStyles}
`
