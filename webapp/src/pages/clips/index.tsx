import { NextPage } from 'next'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { AddClip } from '../../components/AddClip'
import { LinkButton } from '../../components/buttons'
import { Export } from '../../components/Export'
import { Import } from '../../components/Import'
import { Layout } from '../../components/Layout'
import { ProfileClipList } from '../../components/ProfileClipList'
import { useProfile } from '../../hooks/useProfile'

const Clips: NextPage = () => {
  const { profile, isLoading } = useProfile()

  return (
    <Layout>
      {profile && !isLoading && (
        <Container>
          <ClipContainer>
            <ProfileClipList clips={profile.clips} />
          </ClipContainer>
          <AddClip />
          <Link href="/profile">
            <LinkButton>Your profile</LinkButton>
          </Link>
          <Import />
          <Export />
        </Container>
      )}
    </Layout>
  )
}

const ClipContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
`

const Container = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-gap: 0.5rem;
  justify-items: center;
`

export default Clips
