import { browser } from 'webextension-polyfill-ts'
import { exportListener } from './export'
import { importListener } from './import'

browser.runtime.onMessage.addListener(importListener)
browser.runtime.onMessage.addListener(exportListener)
