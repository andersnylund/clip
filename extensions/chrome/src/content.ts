window.addEventListener('message', () => {
  chrome.runtime.sendMessage({ type: 'IMPORT_BOOKMARKS' })
})
