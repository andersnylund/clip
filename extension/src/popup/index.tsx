import React from 'react'
import ReactDOM from 'react-dom'
import { browser } from 'webextension-polyfill-ts'
import Popup from './Popup'
import './styles.css'

const renderApp: () => void = () => {
  ReactDOM.render(
    <>
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
