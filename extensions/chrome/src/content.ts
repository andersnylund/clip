window.addEventListener(
  'message',
  function (event) {
    if (event.source !== window) {
      return
    }

    if (event.data.type && event.data.type === 'IMPORT_BOOKMARKS') {
      console.log('IMPORT_BOOKMARKS')
      chrome.runtime.sendMessage({ ...event.data }, (response) => {
        console.log('response', response)
      })
    }
  },
  false
)
