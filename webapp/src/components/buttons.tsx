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

type Color = 'primary' | 'danger' | 'warning'

const buttonColor: Record<Color, string> = {
  danger: 'red',
  primary: 'orange',
  warning: 'yellow',
}

export const Button = styled.button<{ color?: Color }>`
  ${buttonStyles}

  background-color: ${({ disabled, color }): string => (disabled ? 'lightgrey' : color ? buttonColor[color] : 'white')};
  display: flex;
`

export const LinkButton = styled.a<{ color?: Color }>`
  ${buttonStyles}

  background-color: ${({ color }): string => (color ? buttonColor[color] : 'white')};
`
