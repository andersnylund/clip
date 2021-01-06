window.addEventListener(
  'message',
  function (event) {
    // We only accept messages from ourselves
    if (event.source !== window) return

    if (event.data.type && event.data.type === 'GREET') {
      console.log('Content script received: ' + event.data.text)
      chrome.runtime.sendMessage({ ...event.data }, (response) => {
        console.log('response', response)
      })
    }
  },
  false
)
