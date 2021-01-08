import React, { useEffect, FC } from 'react'
import styled from 'styled-components'

const Popup: FC = () => {
  useEffect(() => {
    console.log('popup.tsx')
  }, [])

  return <Container>Hello, clip!</Container>
}

const Container = styled.div`
  font-size: 2rem;
  padding: 1rem;
`

export default Popup
