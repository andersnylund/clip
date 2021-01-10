import ReactDOM from 'react-dom'

import { renderApp } from './index'

jest.mock('react-dom')

describe('index.tsx', () => {
  it('works', () => {
    expect(chrome.tabs.query).toHaveBeenCalledWith({ active: true, currentWindow: true }, expect.anything())
    chrome.tabs.query
  })

  it('renders the correct elements', () => {
    renderApp()
    expect(ReactDOM.render).toHaveBeenCalledWith(expect.anything(), null)
  })
})
