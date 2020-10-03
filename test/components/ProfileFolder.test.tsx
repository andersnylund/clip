import { render, screen } from '@testing-library/react'

import { ProfileFolder } from '../../src/components/ProfileFolder'
import { useProfile } from '../../src/hooks/useProfile'

jest.mock('../../src/hooks/useProfile', () => ({
  useProfile: jest.fn(),
  PROFILE_PATH: jest.requireActual('../../src/hooks/useProfile').PROFILE_PATH,
}))

jest.mock('swr', () => ({
  mutate: jest.fn(),
}))

describe('<ProfileFolder />', () => {
  it('renders folder name', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({ profile: {} })

    render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)
    expect(screen.getByText('name')).toBeInTheDocument()
  })

  it('renders null if no profile', () => {
    const mockUseProfile = useProfile as jest.Mock
    mockUseProfile.mockReturnValue({})

    const { container } = render(<ProfileFolder folder={{ id: 'id', name: 'name', clips: [] }} />)
    expect(screen.queryByText('name')).not.toBeInTheDocument()
    expect(container).toMatchInlineSnapshot(`<div />`)
  })
})
