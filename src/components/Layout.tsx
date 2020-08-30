import React, { FC } from 'react'
import styled from 'styled-components'

import { Header } from './Header'
import { Footer } from './Footer'

export const Layout: FC = ({ children }) => {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Content = styled.main`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
`
