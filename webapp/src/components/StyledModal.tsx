import ReactModal from 'react-modal'
import styled from 'styled-components'

export const StyledModal = styled(ReactModal)`
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
