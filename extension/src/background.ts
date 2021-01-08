console.log('background.ts')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'IMPORT_BOOKMARKS') {
    chrome.bookmarks.getTree((result) => {
      sendResponse(result)
    })
  }
  return true
})
