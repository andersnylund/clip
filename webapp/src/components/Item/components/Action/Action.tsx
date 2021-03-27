import classNames from 'classnames'
import React, { CSSProperties, FC } from 'react'
import styles from './Action.module.scss'

export interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  active?: {
    fill: string
    background: string
  }
}

export const Action: FC<Props> = ({ active, className, style, ...props }) => (
  <button
    {...props}
    className={classNames(styles.Action, className)}
    tabIndex={0}
    style={
      {
        ...style,
        '--fill': active?.fill,
        '--background': active?.background,
      } as CSSProperties
    }
  />
)
