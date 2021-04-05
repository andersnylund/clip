import { DragHandleDots2Icon } from '@radix-ui/react-icons'
import React, { FC } from 'react'

export const Handle: FC<React.HTMLAttributes<HTMLButtonElement>> = (props) => (
  <button {...props} className="cursor-move p-2 m-2">
    <DragHandleDots2Icon />
  </button>
)
