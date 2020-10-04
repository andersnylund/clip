import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import jestFetchMock from 'jest-fetch-mock'

jestFetchMock.enableMocks()

process.env.APP_URL = 'http://localhost:3000'
