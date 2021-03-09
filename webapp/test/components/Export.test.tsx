import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { getBrowserName } from '../../src/browser'
import { Export } from '../../src/components/Export'
import { useProfile } from '../../src/hooks/useProfile'
import { isSiteEnvDev } from '../../src/hooks/usePublicConfig'

jest.mock('../../src/hooks/useProfile')
jest.mock('../../src/browser', () => ({
  supportedBrowsers: jest.requireActual('../../src/browser').supportedBrowsers,
  getBrowserName: jest.fn(),
}))
jest.mock('../../src/hooks/usePublicConfig')

ReactModal.setAppElement('body')

describe('<Export />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mocked(isSiteEnvDev).mockReturnValue(true)
    mocked(useProfile).mockReturnValue({
      profile: {
        clips: [{ clips: [], id: '1', index: null, parentId: null, title: 'title', userId: 1, url: null }],
        id: 1,
        username: '',
        image: '',
        name: '',
      },
      isLoading: false,
    })
  })

  it('renders the export button', () => {
    render(<Export />)

    expect(screen.getByText('Export bookmarks to bookmark bar')).toBeInTheDocument()
  })

  it('handles the export message', () => {
    mocked(getBrowserName).mockReturnValue('Firefox')

    jest.spyOn(window, 'postMessage')

    render(<Export />)

    fireEvent.click(screen.getByText('Export bookmarks to bookmark bar'))

    expect(window.postMessage).toHaveBeenCalledWith(
      {
        payload: [
          {
            clips: [],
            id: '1',
            index: null,
            parentId: null,
            title: 'title',
            url: null,
            userId: 1,
          },
        ],
        type: 'EXPORT_BOOKMARKS',
      },
      'http://localhost/'
    )
  })

  it('shows invalid browser modal if invalid browser', () => {
    mocked(getBrowserName).mockReturnValue('Safari')

    jest.spyOn(window, 'postMessage')

    render(<Export />)

    fireEvent.click(screen.getByText('Export bookmarks to bookmark bar'))

    expect(window.postMessage).not.toHaveBeenCalled()
  })

  it('shows empty render if no profile', () => {
    mocked(useProfile).mockReturnValue({
      profile: undefined,
      isLoading: false,
    })

    const { container } = render(<Export />)

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('shows empty render if not dev env', () => {
    mocked(isSiteEnvDev).mockReturnValue(false)

    const { container } = render(<Export />)

    expect(container).toMatchInlineSnapshot(`<div />`)
  })
})
