import { ChevronRightIcon } from '@radix-ui/react-icons'
import React, { FC } from 'react'

interface Props {
  onClick: () => void
  collapsed?: boolean
}

export const Collapse: FC<Props> = ({ onClick, collapsed }) => (
  <button
    title="Toggle collapse"
    onClick={onClick}
    className={`p-2 transform transition-transform ${!collapsed ? 'rotate-90' : ''}`}
  >
    <ChevronRightIcon />
  </button>
)
