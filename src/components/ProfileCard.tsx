import React, { FC } from 'react'
import styled from 'styled-components'

export const ProfileCard: FC<{ user: { image: string; username: string } }> = ({ user }) => {
  return (
    <Card>
      <Img src={user.image} alt="User" />
      <H1>{user.username}&apos;s clips</H1>
    </Card>
  )
}

const Card = styled.div`
  align-items: center;
  display: grid;
  grid-gap: 16px;
  grid-template-columns: auto auto;
`

const Img = styled.img`
  border-radius: 50%;
  width: 80px;
`

const H1 = styled.h1`
  font-size: 30px;
`
