import { FC } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { Router } from 'next/router'
import jestMockFetch from 'jest-fetch-mock'

import App from '../../src/pages/_app'
const TestComponent: FC = () => <div>hello</div>

describe('<App />', () => {
  beforeAll(() => {
    jestMockFetch.doMock(
      JSON.stringify({
        user: {
          name: 'Test User',
          email: 'test@user.com',
          image: 'https://avatars0.githubusercontent.com',
        },
        accessToken: 'c42523d064f9f58e88b7f0b9ded259dbc9e5ce9abea67d5e015fd7fb39a65815',
        expires: '2020-10-23T18:48:05.121Z',
      })
    )
  })

  it('renders', async () => {
    render(<App pageProps={{}} Component={TestComponent} router={{} as Router} />)
    await waitFor(() => {
      screen.getByText('hello')
    })
  })
})
