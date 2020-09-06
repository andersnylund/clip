import React, { FC } from 'react'
import Head from 'next/head'
import styled from 'styled-components'

import { Header } from './Header'
import { Footer } from './Footer'
import { DEFAULT_PAGE_TITLE } from '../pages/_document'

interface Props {
  title?: string
}

export const Layout: FC<Props> = ({ title = DEFAULT_PAGE_TITLE, children }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Container>
        <Header />
        <Content>{children}</Content>
        <Footer />
      </Container>
    </>
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
  flex-direction: column;
  flex: 1;
  justify-content: center;
`
