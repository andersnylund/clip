import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { signIn, useSession } from 'next-auth/client'

import { Layout } from '../components/Layout'
import { H2, HugeH1, Button, LinkButton } from '../styles'

const Home: NextPage = () => {
  const [session] = useSession()

  return (
    <Layout>
      <TextContainer>
        <HugeH1>clip.so</HugeH1>
        <H2>
          Access and share your beloved links{' '}
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </H2>
      </TextContainer>
      {session ? (
        <Link href="/profile">
          <LinkButton primary>Your profile</LinkButton>
        </Link>
      ) : (
        <Button primary onClick={() => signIn()}>
          Clip
        </Button>
      )}
    </Layout>
  )
}

const TextContainer = styled.div`
  margin: 32px 0;
  text-align: center;
  max-width: 400px;
`

export default Home
