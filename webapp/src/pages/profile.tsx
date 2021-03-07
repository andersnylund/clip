import React from 'react'
import styled from 'styled-components'
import { NextPage } from 'next'
import Link from 'next/link'

import { Layout } from '../components/Layout'
import { useSignin } from '../hooks/useSignin'
import { LinkButton } from '../components/buttons'
import { useProfile } from '../hooks/useProfile'
import { UsernameModal } from '../components/UsernameModal'
import { UsernamePrompt } from '../components/UsernamePrompt'

const Profile: NextPage = () => {
  const [session] = useSignin()
  const { profile } = useProfile()

  return session ? (
    <Layout>
      {profile && !profile?.username && <UsernameModal />}
      <Container>
        <ProfileImage
          isPlaceholder={Boolean(!session.user.image)}
          src={session.user.image ?? '/android-chrome-256x256.png'}
          alt="Profile"
        />
        <p>{session.user.email}</p>
        <UsernamePrompt />
      </Container>
      {profile?.username && (
        <Description>
          <Link href="/clips">
            <LinkButton primary>Your clips</LinkButton>
          </Link>
        </Description>
      )}
    </Layout>
  ) : null
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
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
