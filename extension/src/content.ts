console.log('content.ts')

window.addEventListener('message', (event) => {
  if (event.data.type === 'IMPORT_BOOKMARKS') {
    chrome.runtime.sendMessage({ type: 'IMPORT_BOOKMARKS' }, (response) => {
      window.postMessage({ type: 'IMPORT_BOOKMARKS_SUCCESS', payload: response }, window.location.toString())
    })
  }
})
