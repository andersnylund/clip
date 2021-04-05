import { TrashIcon } from '@radix-ui/react-icons'
import React, { FC } from 'react'

export const Remove: FC<React.HTMLAttributes<HTMLButtonElement>> = (props) => (
  <button className="hover:bg-gray-100 p-2 m-2 rounded-md" {...props}>
    <TrashIcon />
  </button>
)
