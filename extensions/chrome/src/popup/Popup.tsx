import React, { useEffect, FC } from 'react'

import './Popup.scss'

const Popup: FC = () => {
  useEffect(() => {
    // Example of how to send a message to eventPage.ts.
    chrome.runtime.sendMessage({ popupMounted: true })
  }, [])

  return <div className="popupContainer">Hello, clip!</div>
}

export default Popup
