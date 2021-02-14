import '@testing-library/jest-dom/extend-expect'
import { config } from 'dotenv'
import jestFetchMock from 'jest-fetch-mock'
import 'jest-styled-components'
import { seed } from './seed'

export const TEST_SERVER_ADDRESS = 'http://localhost:3001'

config({ path: '.env.test' })
jestFetchMock.enableMocks()
seed()
