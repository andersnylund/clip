import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { AddClip } from '../../components/AddClip'
import { LinkButton } from '../../components/buttons'
import { Import } from '../../components/Import'
import { Layout } from '../../components/Layout'
import { ProfileClipList } from '../../components/ProfileClipList'
import { useProfile } from '../../hooks/useProfile'

const Clips: NextPage = () => {
  const { profile, isLoading } = useProfile()

  return (
    <Layout>
      {profile && !isLoading && (
        <>
          <Container>
            <ProfileClipList clips={profile.clips} />
          </Container>
          <AddClip />
          <Link href={`/clips/${profile.username}`}>
            <LinkButton>Your public profile</LinkButton>
          </Link>
          <Import />
        </>
      )}
    </Layout>
  )
}

const Container = styled.div`
  display: grid;
  grid-gap: 1rem;
`

export default Clips
