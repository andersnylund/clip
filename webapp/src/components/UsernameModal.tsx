import React, { FC, useState } from 'react'
import ReactModal from 'react-modal'
import styled from 'styled-components'
import { Button } from './buttons'
import { StyledModal } from './StyledModal'
import { UsernamePrompt } from './UsernamePrompt'

ReactModal.setAppElement('body')

export const UsernameModal: FC = () => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <StyledModal isOpen={isOpen}>
      <ButtonContainer>
        <Button title="close" onClick={() => setIsOpen(false)}>
          ⅹ
        </Button>
      </ButtonContainer>
      <TextContainer>
        <p>Set an username for yourself</p>
        <UsernamePrompt defaultOpen={true} />
      </TextContainer>
    </StyledModal>
  )
}

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`

const TextContainer = styled.div`
  padding: 16px;
`
