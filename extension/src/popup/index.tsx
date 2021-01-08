import React from 'react'
import ReactDOM from 'react-dom'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
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
