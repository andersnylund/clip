import styled, { css } from 'styled-components'

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

export const Button = styled.button<{ primary?: boolean }>`
  ${buttonStyles}

  background-color: ${({ primary }): string => (primary ? 'orange' : 'white')}
`

export const LinkButton = styled.a<{ primary?: boolean }>`
  ${buttonStyles}

  background-color: ${({ primary }): string => (primary ? 'orange' : 'white')}
`
