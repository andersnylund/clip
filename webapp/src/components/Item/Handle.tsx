import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import React, { FC } from 'react'

interface Props {
  id: string
}

export const Handle: FC<React.HTMLAttributes<HTMLButtonElement> & Props> = ({ id, ...props }) => (
  <button {...props} data-testid={`handle-${id}`} className="cursor-move p-2 m-2">
    <DragHandleDots2Icon />
  </button>
)
