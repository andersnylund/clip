let bookmarkBarId = '1'

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  chrome.bookmarks.create(
    { parentId: bookmarkBarId, title: 'Test bookmark', url: 'https://google.com' },
    function (newFolder) {
      console.log('added folder: ' + newFolder.title)
    }
  )

  sendResponse({ message: 'success' })
  return true
})
