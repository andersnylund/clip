import { NextPage } from 'next'
import { useSession } from 'next-auth/client'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import { useProfile } from '../../../shared/hooks/useProfile'
import { AddClip } from '../components/AddClip'
import { LinkButton } from '../components/buttons'
import { Export } from '../components/Export'
import { Import } from '../components/Import'
import { Layout } from '../components/Layout'
import { ProfileClipList } from '../components/ProfileClipList'

const Clips: NextPage = () => {
  const { profile, isLoading } = useProfile()
  const [session, loading] = useSession()
  const router = useRouter()

  if (!session && !loading) {
    router.push('/')
  }

  return (
    <Layout title="Your clips">
      {profile && !isLoading && (
        <Container>
          <ProfileClipList clips={profile.clips} />
          <AddClip />
          <Link href="/profile" passHref>
            <LinkButton>Your profile</LinkButton>
          </Link>
          <Import />
          <Export />
        </Container>
      )}
    </Layout>
  )
}

const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 0.5rem;
  justify-items: center;
`

export default Clips
