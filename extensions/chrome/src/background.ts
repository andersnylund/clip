chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // chrome.bookmarks.create(
  //   { parentId: bookmarkBarId, title: 'Test bookmark', url: 'https://google.com' },
  //   function (newFolder) {
  //     console.log('added folder: ' + newFolder.title)
  //   }
  // )

  console.log('request', request)
  console.log('sender', sender)

  sendResponse({ message: 'success' })
  return true
})
