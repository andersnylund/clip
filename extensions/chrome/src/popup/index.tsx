import React from 'react'
import ReactDOM from 'react-dom'
import Popup from './Popup'
import 'crx-hotreload'

chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
  ReactDOM.render(<Popup />, document.getElementById('popup'))
})
