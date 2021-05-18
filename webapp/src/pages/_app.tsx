import { Provider as NextAuthProvider } from 'next-auth/client'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { ReactElement } from 'react'
import { Provider as ReduxProvider } from 'react-redux'
import 'tailwindcss/tailwind.css'
import { store } from '../store'

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <ReduxProvider store={store}>
        <NextAuthProvider session={pageProps.session}>
          <Component {...pageProps} />
        </NextAuthProvider>
      </ReduxProvider>
    </>
  )
}

export default App
