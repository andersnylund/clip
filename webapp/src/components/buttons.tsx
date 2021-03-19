import { AnchorHTMLAttributes, ButtonHTMLAttributes, DetailedHTMLProps, FC, HTMLProps, LinkHTMLAttributes } from 'react'
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
  warning: '#FFC900',
}

export const PrimaryLink: FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    {...props}
    className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base transition-colors font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-600"
  />
)

export const TransparentButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className={`flex items-center justify-center px-4 py-2 rounded-md text-base transition-colors font-medium text-gray-900 bg-transparent hover:bg-gray-200`}
  />
)

export const YellowButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
  <button
    {...props}
    className={`flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base transition-colors font-medium text-gray-900 bg-yellow-500 hover:bg-yellow-600`}
  />
)

export const Button = styled.button<{ color?: Color }>`
  ${buttonStyles}

  background-color: ${({ disabled, color }): string => (disabled ? 'lightgrey' : color ? buttonColor[color] : 'white')};
  display: flex;
`

export const LinkButton = styled.a<{ color?: Color }>`
  ${buttonStyles}

  background-color: ${({ color }): string => (color ? buttonColor[color] : 'white')};
`
