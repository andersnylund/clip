import { ReactElement } from 'react'
import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'
import Head from 'next/head'

import { GlobalStyles } from '../GlobalStyles'

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <GlobalStyles />
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App
