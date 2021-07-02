import React, { FC } from 'react'
import styled from 'styled-components'

import { User } from '../../../shared/types'

export const ProfileCard: FC<{ user: User }> = ({ user }) => {
  return (
    <Card>
      <Img src={user.image ?? undefined} alt="User" />
      <H1>{user.username}&apos;s clips</H1>
    </Card>
  )
}

const Card = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const Img = styled.img`
  border-radius: 50%;
  margin: 0 16px;
  width: 80px;
`

const H1 = styled.h1`
  font-size: 30px;
`
