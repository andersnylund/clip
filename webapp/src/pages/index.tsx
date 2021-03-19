import { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/client'
import Link from 'next/link'
import styled from 'styled-components'
import { PrimaryLink, YellowButton } from '../components/buttons'
import { Layout } from '../components/Layout'
import { H2, HugeH1 } from '../text-styles'

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
          <PrimaryLink>Your profile</PrimaryLink>
        </Link>
      ) : (
        <YellowButton onClick={() => signIn()}>Clip</YellowButton>
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
