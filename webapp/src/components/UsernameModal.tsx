import { Cross1Icon } from '@radix-ui/react-icons'
import React, { FC, useState } from 'react'
import ReactModal from 'react-modal'
import { TransparentButton } from './buttons'
import { StyledModal } from './StyledModal'
import { UsernamePrompt } from './UsernamePrompt'

ReactModal.setAppElement('body')

export const UsernameModal: FC = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <StyledModal isOpen={isOpen}>
      <div className="m-2">
        <div className="flex justify-end">
          <TransparentButton title="close" onClick={() => setIsOpen(false)}>
            <Cross1Icon />
          </TransparentButton>
        </div>
        <div className="m-10">
          <p className="pb-10 text-gray-800">Set an username for yourself</p>
          <UsernamePrompt defaultOpen={true} />
        </div>
      </div>
    </StyledModal>
  )
}
