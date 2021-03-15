import React, { FC } from 'react'
import styled from 'styled-components'
import { Button } from './buttons'
import { StyledModal } from './StyledModal'

interface Props {
  isInvalidBrowser: boolean
  onClose: () => void
}

export const NotSupportedModal: FC<Props> = ({ isInvalidBrowser, onClose }) => (
  <StyledModal isOpen={isInvalidBrowser}>
    <ModalContainer>
      <p>
        Only Firefox and Chrome are currently supported{' '}
        <span role="img" aria-label="sad">
          😢
        </span>
      </p>
      <Button onClick={onClose}>Close</Button>
    </ModalContainer>
  </StyledModal>
)

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  text-align: center;
`
