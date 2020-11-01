import React, { FC, useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'

import { Button } from './buttons'
import { UsernamePrompt } from './UsernamePrompt'

ReactModal.setAppElement('body')

export const UsernameModal: FC = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <StyledModal isOpen={isOpen}>
      <ButtonContainer>
        <Button onClick={() => setIsOpen(false)}>ⅹ</Button>
      </ButtonContainer>
      <TextContainer>
        <p>Set an username for yourself</p>
        <UsernamePrompt />
      </TextContainer>
    </StyledModal>
  )
}

const StyledModal = styled(ReactModal)`
  background: white;
  border-radius: 8px;
  border: 1px solid lightgrey;
  box-shadow: 8px 8px 12px #bbb6b7, -8px -8px 12px #ffffff;
  left: 50%;
  max-width: 400px;
  padding: 4px;
  position: fixed;
  top: 50%;
  transform: translate(-50%, -50%);
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const TextContainer = styled.div`
  padding: 16px;
`
