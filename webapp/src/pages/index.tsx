import { NextPage } from 'next'
import Link from 'next/link'
import styled from 'styled-components'
import { signIn, useSession } from 'next-auth/client'

import { Layout } from '../components/Layout'
import { H2, HugeH1 } from '../text-styles'
import { Button, LinkButton } from '../components/buttons'

const Home: NextPage = () => {
  const [session] = useSession()

  return (
    <Layout>
      <TextContainer>
        <Header>
          <Clip src="/clip.svg" alt="Clip" />
          <HugeH1>clip.so</HugeH1>
        </Header>
        <H2>Access and share your beloved links</H2>
        <p>
          <span role="img" aria-label="heart">
            ❤️
          </span>
        </p>
      </TextContainer>
      {session ? (
        <Link href="/profile">
          <LinkButton color="primary">Your profile</LinkButton>
        </Link>
      ) : (
        <Button color="primary" onClick={() => signIn()}>
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

const Header = styled.div`
  align-items: center;
  display: grid;
  grid-template-columns: auto auto;
  justify-content: center;
  grid-gap: 8px;
`

const Clip = styled.img`
  height: 56px;
`

export default Home
