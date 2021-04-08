import React, { forwardRef, HTMLAttributes } from 'react'
import { Collapse } from '../Item/Collapse'
import { Handle } from '../Item/Handle'
import { Remove } from '../Item/Remove'

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
        className={`list-none 
        ${clone ? 'inline-block pointer-events-none opacity-80' : ''} 
        ${disableSelection ? 'select-none' : ''} 
        ${disableInteraction ? 'pointer-events-none' : ''}`}
        ref={wrapperRef}
        style={
          {
            paddingLeft: `${indentationWidth * depth}px`,
            marginBottom: '-1px',
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          className={`relative flex items-center p-2 ${
            item.url ? 'bg-gray-200' : 'bg-gray-50'
          }  border-gray-100 border rounded-md`}
          ref={ref}
          style={style}
        >
          <Handle id={item.id} {...handleProps} />
          {onCollapse && <Collapse onClick={onCollapse} collapsed={collapsed} />}
          <a href={item.url ?? undefined} className="pl-2 flex-grow overflow-hidden whitespace-nowrap">
            {item.title}
          </a>
          {!clone && onRemove && <Remove onClick={onRemove} />}
          {clone && childCount && childCount > 1 ? (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-6 h-6 rounded-full border-white border-2 bg-blue-600 text-white text-xs">
              {childCount}
            </span>
          ) : null}
        </div>
      </li>
    )
  }
)

TreeItem.displayName = 'TreeItem'
