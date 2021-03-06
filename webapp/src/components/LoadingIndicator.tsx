import React, { FC } from 'react'
import styled from 'styled-components'

const Ball = styled.div<{ delay: number }>`
  animation: float 0.8s ${({ delay }) => delay}s ease-in-out infinite;
  background-color: lightgray;
  border-radius: 50%;
  height: 10px;
  width: 10px;

  @keyframes float {
    0% {
      transform: translateY(-2px);
    }
    50% {
      transform: translateY(2px);
    }
    100% {
      transform: translateY(-2px);
    }
  }
`

const Container = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 4px;
  justify-content: center;
  padding: 5px;
`

export const LoadingIndicator: FC = () => (
  <Container>
    <Ball delay={0} />
    <Ball delay={0.2} />
    <Ball delay={0.4} />
  </Container>
)
