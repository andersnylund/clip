import styled from 'styled-components'

export const HugeH1 = styled.h1`
  font-size: 56px;
`

export const H2 = styled.h2``

export const Label = styled.label`
  color: grey;

  p {
    margin: 4px 0;
  }

  input {
    border-radius: 4px;
    padding: 4px;
    font-size: 18px;
    font-weight: 600;
    border: 1px solid lightgray;
    &:focus {
      outline: 2px solid gray;
    }
  }
`
