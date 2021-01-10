export const handleEvent = (event: MessageEvent): void => {
  if (event.data.type === 'IMPORT_BOOKMARKS') {
    chrome.runtime.sendMessage({ type: 'IMPORT_BOOKMARKS' }, (response) => {
      window.postMessage({ type: 'IMPORT_BOOKMARKS_SUCCESS', payload: response }, window.location.toString())
    })
  }
}

window.addEventListener('message', handleEvent)
