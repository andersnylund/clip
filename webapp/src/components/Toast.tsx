import { CheckIcon, Cross2Icon, Cross1Icon } from '@radix-ui/react-icons'
import { motion, Variants } from 'framer-motion'
import React, { FC } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { setIsOpen } from '../notifications/notification-reducer'

export const Toast: FC = () => {
  const { toastType, message, isOpen } = useAppSelector((state) => state.notification)
  const dispatch = useAppDispatch()

  const variants: Variants = {
    open: { y: -10 },
    closed: { y: 200 },
  }

  const Icon = toastType === 'SUCCESS' ? CheckIcon : Cross1Icon

  return (
    <motion.div
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      transition={{ velocity: 2 }}
      className={`fixed bottom-0 left-1/2`}
    >
      <div className={`relative -left-1/2 overflow-hidden rounded-lg bg-gray-100  shadow-lg flex`}>
        <div
          data-testid="toast-color"
          className={`${toastType === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'} p-5 flex items-center`}
        >
          <Icon color="white" />
        </div>
        <div className="p-8 flex items-center gap-8 font-bold max-w-lg">
          <div>{message}</div>
          <button className="p-2 flex items-center" title="Close toast" onClick={() => dispatch(setIsOpen(false))}>
            <Cross2Icon />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
