import { NextPage } from 'next'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'

export const AddBookmark: NextPage = () => {
  useSignin()

  return <Layout>TODO</Layout>
}

export default AddBookmark
