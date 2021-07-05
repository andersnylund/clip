import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import ReactModal from 'react-modal'
import { mocked } from 'ts-jest/utils'
import { useProfile } from '../../../shared/hooks/useProfile'
import { EXPORT_BOOKMARKS, EXPORT_BOOKMARKS_SUCCESS } from '../../../shared/message-types'
import { getBrowserName } from '../../src/browser'
import { Export } from '../../src/components/Export'
import { TestProvider, testStore } from '../TestProvider'

jest.mock('../../../shared/hooks/useProfile')
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
          {
            browserIds: [],
            clips: [],
            collapsed: false,
            id: '1',
            index: null,
            parentId: null,
            title: 'title',
            url: null,
            userId: 1,
          },
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
    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )
    expect(screen.getByText('Export to bookmark bar')).toBeInTheDocument()
  })

  it('handles the export message', () => {
    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )

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
        type: EXPORT_BOOKMARKS,
      },
      'http://localhost/'
    )

    expect(screen.queryByText('Export and overwrite')).not.toBeInTheDocument()
  })

  it('closes the modal with cancel', async () => {
    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )
    fireEvent.click(screen.getByText('Export to bookmark bar'))
    screen.getByText('Export and overwrite')
    fireEvent.click(screen.getByText('Cancel'))
    expect(screen.queryByText('Export and overwrite')).not.toBeInTheDocument()
    // TODO: add test of onRequestClose
  })

  it('shows invalid browser modal if invalid browser', () => {
    mocked(getBrowserName).mockReturnValue('Safari')

    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )

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

    const { container } = render(
      <TestProvider>
        <Export />
      </TestProvider>
    )

    expect(container).toMatchInlineSnapshot(`<div />`)
  })

  it('sets the loading state when clicking import', () => {
    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )

    fireEvent.click(screen.getByText('Export to bookmark bar'))
    fireEvent.click(screen.getByText('Export and overwrite'))

    expect(testStore.getState().importExport).toEqual({
      exportState: 'LOADING',
      importState: 'INITIAL',
    })
    screen.getByTestId('loading-spinner')
  })

  it('handles the export success message and closes the modal', () => {
    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: EXPORT_BOOKMARKS_SUCCESS },
      })
    )

    expect(testStore.getState().importExport).toEqual({
      exportState: 'SUCCESS',
      importState: 'INITIAL',
    })
    expect(screen.queryByText('Export and overwrite')).not.toBeInTheDocument()
  })

  it('does not handle any other messages than EXPORT_BOOKMARKS_SUCCESS', () => {
    jest.spyOn(window, 'postMessage')

    render(
      <TestProvider>
        <Export />
      </TestProvider>
    )

    fireEvent(
      window,
      new MessageEvent('message', {
        data: { type: 'SOME_OTHER_MESSAGE' },
      })
    )

    expect(testStore.getState().importExport).toEqual({
      exportState: 'INITIAL',
      importState: 'INITIAL',
    })
    expect(screen.queryByText('Export and overwrite')).not.toBeInTheDocument()
  })
})
