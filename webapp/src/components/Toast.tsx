import { motion, Variants } from 'framer-motion'
import React, { FC } from 'react'
import { useAppSelector } from '../hooks'

export const Toast: FC = () => {
  const { toastType, message, isOpen } = useAppSelector((state) => state.notification)

  const variants: Variants = {
    open: { y: -10 },
    closed: { y: 50 },
  }

  return (
    <motion.div
      animate={isOpen ? 'open' : 'closed'}
      variants={variants}
      transition={{ velocity: 2 }}
      className={`fixed bottom-0 left-1/2`}
    >
      <div
        className={`relative -left-1/2 p-2 rounded-lg ${
          toastType === 'SUCCESS' ? 'bg-green-500' : 'bg-red-500'
        } font-bold shadow-md`}
      >
        {message}
      </div>
    </motion.div>
  )
}
