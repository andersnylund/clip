import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { getBrowserName } from '../../src/browser'
import { Export } from '../../src/components/Export'
import { useProfile } from '../../src/hooks/useProfile'

jest.mock('../../src/hooks/useProfile')
jest.mock('../../src/browser', () => ({
  supportedBrowsers: jest.requireActual('../../src/browser').supportedBrowsers,
  getBrowserName: jest.fn(),
}))

ReactModal.setAppElement('body')

describe('<Export />', () => {
  beforeEach(() => {
    mocked(getBrowserName).mockReturnValue('Firefox')
    jest.clearAllMocks()
    mocked(useProfile).mockReturnValue({
      profile: {
        clips: [
          { clips: [], id: '1', collapsed: false, index: null, parentId: null, title: 'title', userId: 1, url: null },
        ],
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

    expect(screen.getByText('Export to bookmark bar')).toBeInTheDocument()
  })

  it('handles the export message', () => {
    jest.spyOn(window, 'postMessage')

    render(<Export />)

    fireEvent.click(screen.getByText('Export to bookmark bar'))
    fireEvent.click(screen.getByText('Export and overwrite'))

    expect(window.postMessage).toHaveBeenCalledWith(
      {
        payload: [
          {
            clips: [],
            id: '1',
            collapsed: false,
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

    expect(screen.queryByText('Export and overwrite')).not.toBeInTheDocument()
  })

  it('closes the modal with cancel', async () => {
    render(<Export />)
    fireEvent.click(screen.getByText('Export to bookmark bar'))
    screen.getByText('Export and overwrite')
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Export and overwrite')).not.toBeInTheDocument()
    // TODO: add test of onRequestClose
  })

  it('shows invalid browser modal if invalid browser', () => {
    mocked(getBrowserName).mockReturnValue('Safari')

    jest.spyOn(window, 'postMessage')

    render(<Export />)

    fireEvent.click(screen.getByText('Export to bookmark bar'))

    expect(window.postMessage).not.toHaveBeenCalled()
    screen.getByText('Only Firefox, Chrome and Brave are currently supported')

    fireEvent.click(screen.getByText('Close'))
    expect(screen.queryByText('Only Firefox, Chrome and Brave are currently supported')).not.toBeInTheDocument()
  })

  it('shows empty render if no profile', () => {
    mocked(useProfile).mockReturnValue({
      profile: undefined,
      isLoading: false,
    })

    const { container } = render(<Export />)

    expect(container).toMatchInlineSnapshot(`<div />`)
  })
})
