chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.bookmarks.getTree((results) => {
    sendResponse(results)
  })
  return true
})
