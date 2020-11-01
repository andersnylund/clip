import { render, screen } from '@testing-library/react'
import { GetServerSidePropsContext } from 'next'
import { Session } from 'next-auth/client'
import { ParsedUrlQuery } from 'querystring'
import { HttpError } from '../../../src/error/http-error'
import { fetchUser } from '../../../src/hooks/useUser'

import Username, { getServerSideProps } from '../../../src/pages/clips/[username]'
import { User } from '../../../src/types'

const mockUser: User = {
  clips: [],
  folders: [],
  id: 1,
  image: 'image',
  name: 'name',
  username: 'username',
}

jest.mock('next-auth/client', () => ({
  useSession: jest.fn(() => [{ user: { image: 'image', name: 'name' } } as Session, false]),
}))

jest.mock('../../../src/hooks/useUser', () => ({
  fetchUser: jest.fn(() => ({ username: 'hello' })),
}))

describe('<Username />', () => {
  beforeEach(jest.clearAllMocks)

  it('renders ', () => {
    render(<Username user={mockUser} error={null} />)
    screen.getByText(mockUser.name ?? 'should not be found')
  })

  it('renders error if fetching data fails', () => {
    render(<Username user={mockUser} error={new HttpError('fail', 'info', 500)} />)
    screen.getByText(/Internal Server Error/)
  })

  it('renders error if no user', () => {
    render(<Username user={null} error={null} />)
    screen.getByText(/Internal Server Error/)
  })

  describe('getServerSideProps', () => {
    it('returns the user', async () => {
      const result = await getServerSideProps(({
        query: { username: 'username' },
        res: { statusCode: 200 },
      } as unknown) as GetServerSidePropsContext<ParsedUrlQuery>)
      expect(fetchUser).toHaveBeenCalledWith('username')
      expect(result).toEqual({
        props: {
          error: null,
          user: {
            username: 'hello',
          },
        },
      })
    })

    it('handles array query', async () => {
      const result = await getServerSideProps(({
        query: { username: ['first', 'second'] },
        res: { statusCode: 200 },
      } as unknown) as GetServerSidePropsContext<ParsedUrlQuery>)
      expect(fetchUser).toHaveBeenCalledWith('first')
      expect(result).toEqual({
        props: {
          error: null,
          user: {
            username: 'hello',
          },
        },
      })
    })

    it('handles array query', async () => {
      const result = await getServerSideProps(({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        query: { username: () => {} },
        res: { statusCode: 200 },
      } as unknown) as GetServerSidePropsContext<ParsedUrlQuery>)
      expect(fetchUser).toHaveBeenCalledWith('')
      expect(result).toEqual({
        props: {
          error: null,
          user: {
            username: 'hello',
          },
        },
      })
    })

    it('sets error if fetching user throws error', async () => {
      const mockFetchUser = fetchUser as jest.Mock
      mockFetchUser.mockRejectedValue(new HttpError('message', 'info', 500))
      const result = await getServerSideProps(({
        query: { username: 'username' },
        res: { statusCode: 200 },
      } as unknown) as GetServerSidePropsContext<ParsedUrlQuery>)
      expect(result).toEqual({
        props: {
          error: {
            info: 'message',
            statusCode: 500,
          },
          user: null,
        },
      })
    })

    it('sets 500 status code fetching user throws generic error', async () => {
      const mockFetchUser = fetchUser as jest.Mock
      mockFetchUser.mockRejectedValue(new Error('message'))
      const result = await getServerSideProps(({
        query: { username: 'username' },
        res: { statusCode: 200 },
      } as unknown) as GetServerSidePropsContext<ParsedUrlQuery>)
      expect(result).toEqual({
        props: {
          error: {
            info: 'message',
            statusCode: 500,
          },
          user: null,
        },
      })
    })
  })
})
