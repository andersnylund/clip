import React, { FC, useState } from 'react'
import { Switch } from '@headlessui/react'

interface Props {
  label: string
}

export const Toggle: FC<Props> = ({ label }) => {
  const [checked, setChecked] = useState(false)

  return (
    <div className="flex flex-col items-center gap-2 text-gray-800">
      <Switch.Group>
        <Switch.Label>{label}</Switch.Label>
        <Switch
          checked={checked}
          onChange={setChecked}
          className={`${
            checked ? 'bg-green-500' : 'bg-gray-200'
          } relative inline-flex flex-shrink-0 h-8 w-14 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-1 focus:ring-blue-400`}
        >
          <span className="sr-only">{label}</span>
          <span
            aria-hidden="true"
            className={`${
              checked ? 'translate-x-6' : 'translate-x-0'
            } pointer-events-none inline-block h-7 w-7 rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
          />
        </Switch>
      </Switch.Group>
    </div>
  )
}
