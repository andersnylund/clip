import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'

import { Layout } from '../components/Layout'
import { LinkButton } from '../components/styles'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Bookmarks.by</h1>
      <Link href="/add">
        <LinkButton>Add folder</LinkButton>
      </Link>
    </Layout>
  )
}

export default Home
