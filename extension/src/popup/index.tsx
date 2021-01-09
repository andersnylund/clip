import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    margin: 0;
  }

`

import Popup from './Popup'

chrome.tabs.query({ active: true, currentWindow: true }, () => {
  ReactDOM.render(
    <>
      <GlobalStyle />
      <Popup />
    </>,
    document.getElementById('popup')
  )
})
