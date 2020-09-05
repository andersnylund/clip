import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'

import { Layout } from '../components/Layout'
import { LinkButton } from '../components/styles'

const Home: NextPage = () => {
  return (
    <Layout>
      <h1>Bookmarks.by</h1>
      <Link href="/add-folder">
        <LinkButton>Add folder</LinkButton>
      </Link>
      <Link href="/add-bookmark">
        <LinkButton>Add bookmark</LinkButton>
      </Link>
    </Layout>
  )
}

export default Home
