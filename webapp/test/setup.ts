import '@testing-library/jest-dom/extend-expect'
import { config } from 'dotenv'
import jestFetchMock from 'jest-fetch-mock'
import 'jest-styled-components'
import prisma from '../src/prisma'

process.env.APP_URL = 'http://localhost:3001'
process.env.EMAIL_FROM = 'testvalue'
process.env.EMAIL_SERVER_HOST = 'testvalue'
process.env.EMAIL_SERVER_PASSWORD = 'testvalue'
process.env.EMAIL_SERVER_PORT = '123'
process.env.EMAIL_SERVER_USER = 'testvalue'
process.env.GITHUB_ID = 'testvalue'
process.env.GITHUB_SECRET = 'testvalue'
process.env.NEXTAUTH_SECRET = 'testvalue'
process.env.NEXTAUTH_URL = 'http://localhost:3001'
process.env.SITE_ENV = 'dev'
process.env.DATABASE_URL = 'postgres://clip:password@localhost:5433/clip'

config({ path: '.env.test' })
jestFetchMock.enableMocks()
global.prisma = prisma

export const TEST_SERVER_ADDRESS = 'http://localhost:3001'
