console.log('chrome.runtime.getPackageDirectoryEntry', chrome.runtime.getPackageDirectoryEntry)
if (chrome.runtime.getPackageDirectoryEntry) {
  // run crx-hotreload only in chrome
  // firefox can be debugged with web-ext
  ;(async () => {
    await require('crx-hotreload')
  })()
}

console.log('background.ts')

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'IMPORT_BOOKMARKS') {
    chrome.bookmarks.getTree((result) => {
      sendResponse(result)
    })
  }
  return true
})
