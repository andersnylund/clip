import { NextPage } from 'next'
import { signIn, useSession } from 'next-auth/client'
import Link from 'next/link'
import { LinkButton, PrimaryLink, YellowButton } from '../components/buttons'
import { Layout } from '../components/Layout'
import { H2, HugeH1 } from '../text-styles'

const Home: NextPage = () => {
  const [session] = useSession()

  return (
    <Layout>
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center">
          <img className="w-12" src="/clip.svg" alt="Clip" />
          <HugeH1>clip.so</HugeH1>
        </div>
        <H2>Cross browser bookmarks</H2>
      </div>
      <div className="p-12">
        {session ? (
          <Link href="/profile" passHref>
            <PrimaryLink>Your profile</PrimaryLink>
          </Link>
        ) : (
          <YellowButton onClick={() => signIn()}>Clip</YellowButton>
        )}
      </div>

      <Link href="/get-started">
        <LinkButton>How does it work?</LinkButton>
      </Link>
    </Layout>
  )
}

export default Home
