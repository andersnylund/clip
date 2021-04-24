import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import React, { FC } from 'react'

interface Props {
  title: string
}

export const Handle: FC<React.HTMLAttributes<HTMLButtonElement> & Props> = ({ title, ...props }) => (
  <button {...props} data-testid={`handle-${title}`} className="cursor-move p-2 m-2">
    <DragHandleDots2Icon />
  </button>
)
