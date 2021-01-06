window.addEventListener(
  'message',
  function (event) {
    if (event.source !== window) {
      return
    }

    if (event.data.type && event.data.type === 'IMPORT_BOOKMARKS') {
      chrome.runtime.sendMessage({ ...event.data }, (response) => {
        window.postMessage({ type: 'IMPORT_BOOKMARKS_SUCCESS', bookmarks: response }, window.location.toString())
      })
    }
  },
  false
)
