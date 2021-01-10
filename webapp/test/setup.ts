import '@testing-library/jest-dom/extend-expect'
import 'jest-styled-components'
import jestFetchMock from 'jest-fetch-mock'

jestFetchMock.enableMocks()

process.env.APP_URL = 'http://localhost:3000'
process.env.EMAIL_FROM = 'testvalue'
process.env.EMAIL_SERVER_HOST = 'testvalue'
process.env.EMAIL_SERVER_PASSWORD = 'testvalue'
process.env.EMAIL_SERVER_PORT = '123'
process.env.EMAIL_SERVER_USER = 'testvalue'
process.env.GITHUB_ID = 'testvalue'
process.env.GITHUB_SECRET = 'testvalue'
process.env.NEXTAUTH_SECRET = 'testvalue'
process.env.NEXTAUTH_URL = 'testvalue'
process.env.SITE_ENV = 'dev'
