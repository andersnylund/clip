import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { useProfile } from '../../../shared/hooks/useProfile'
import { LinkButton } from '../components/buttons'
import { DeleteProfile } from '../components/DeleteProfile'
import { Layout } from '../components/Layout'
import { UsernameModal } from '../components/UsernameModal'
import { UsernamePrompt } from '../components/UsernamePrompt'
import { useSignin } from '../hooks/useSignin'

const Profile: NextPage = () => {
  const [session, loading] = useSignin()
  const { profile } = useProfile()
  const router = useRouter()

  if (!session && !loading) {
    router.push('/')
  }

  return session ? (
    <Layout title="Your profile">
      {profile && !profile?.username && <UsernameModal />}
      <Container>
        <ProfileImage
          isPlaceholder={Boolean(!session?.user?.image)}
          src={session?.user?.image ?? '/android-chrome-256x256.png'}
          alt="Profile"
        />
        <p>{session?.user?.email}</p>
        <UsernamePrompt />
        {profile?.username && (
          <Description>
            <Link href="/clips" passHref>
              <LinkButton color="primary">Your clips</LinkButton>
            </Link>
          </Description>
        )}
        <DeleteProfile profile={profile} />
      </Container>
    </Layout>
  ) : null
}

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-auto-flow: row;
  justify-items: center;
`

const ProfileImage = styled.img<{ isPlaceholder?: boolean }>`
  border-radius: 50%;
  height: 200px;
  object-fit: cover;
  width: 200px;
  background-color: ${({ isPlaceholder }) => (isPlaceholder ? 'lightgray' : 'none')};
`

const Description = styled.div`
  align-items: center;
  color: darkgray;
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  text-align: center;
  margin-top: 2rem;

  a {
    display: block;
    color: black;
  }
`

export default Profile
