import { AppProps } from 'next/app'
import { Provider } from 'next-auth/client'

import { GlobalStyles } from '../GlobalStyles'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <GlobalStyles />
      <Provider session={pageProps.session}>
        <Component {...pageProps} />
      </Provider>
    </>
  )
}

export default App
