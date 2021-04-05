import classNames from 'classnames'
import React, { forwardRef, HTMLAttributes } from 'react'
import { Collapse } from '../Item/Collapse'
import { Handle } from '../Item/Handle'
import { Remove } from '../Item/Remove'
import styles from './TreeItem.module.scss'

export interface Props extends HTMLAttributes<HTMLLIElement> {
  childCount?: number
  clone?: boolean
  collapsed?: boolean
  depth: number
  disableInteraction?: boolean
  disableSelection?: boolean
  ghost?: boolean
  handleProps?: {
    role: string
    tabIndex: number
    'aria-pressed': boolean | undefined
    'aria-roledescription': string
    'aria-describedby': string
  }
  indicator?: boolean
  indentationWidth: number
  item: { id: string; title: string; url: string | null }
  onCollapse?(): void
  onRemove?(): void
  wrapperRef?(node: HTMLLIElement): void
}

export const TreeItem = forwardRef<HTMLDivElement, Props>(
  (
    {
      childCount,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      indicator,
      collapsed,
      onCollapse,
      onRemove,
      style,
      item,
      wrapperRef,
      ...props
    },
    ref
  ) => {
    return (
      <li
        className={classNames(
          styles.Wrapper,
          clone && styles.clone,
          ghost && styles.ghost,
          indicator && styles.indicator,
          disableSelection && styles.disableSelection,
          disableInteraction && styles.disableInteraction
        )}
        ref={wrapperRef}
        style={
          {
            '--spacing': `${indentationWidth * depth}px`,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className={classNames(styles.TreeItem, item.url && styles.Clip)} ref={ref} style={style}>
          <Handle {...handleProps} />
          {onCollapse && <Collapse onClick={onCollapse} collapsed={collapsed} />}
          <a href={item.url ?? undefined} className={styles.Text}>
            {item.title}
          </a>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? <span className={styles.Count}>{childCount}</span> : null}
        </div>
      </li>
    )
  }
)

TreeItem.displayName = 'TreeItem'
