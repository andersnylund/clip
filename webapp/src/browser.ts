import { UAParser } from 'ua-parser-js'

export const supportedBrowsers = ['Firefox', 'Chrome']

export const getBrowserName = (): string | undefined => new UAParser().getBrowser().name
