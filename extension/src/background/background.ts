import { browser } from 'webextension-polyfill-ts'
import { importExportListener } from './import-export'

browser.runtime.onMessage.addListener(importExportListener)
