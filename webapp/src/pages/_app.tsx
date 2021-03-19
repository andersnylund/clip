import { Provider } from 'next-auth/client'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement } from 'react'
import 'tailwindcss/tailwind.css'

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App
