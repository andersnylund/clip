import React, { useEffect, FC } from 'react'
import styled from 'styled-components'

const Popup: FC = () => {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true })
  }, [])

  return <Container>Hello, clip!</Container>
}

const Container = styled.div`
  font-size: 2rem;
  padding: 1rem;
`

export default Popup
