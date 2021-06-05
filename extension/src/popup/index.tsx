import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'
import { browser } from 'webextension-polyfill-ts'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
  }

`

import Popup from './Popup'

const renderApp: () => void = () => {
  ReactDOM.render(
    <>
      <GlobalStyle />
      <Popup />
    </>,
    document.getElementById('popup')
  )
}

export const start = async (): Promise<void> => {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true })
  if (tabs?.length) {
    renderApp()
  }
}

start()
