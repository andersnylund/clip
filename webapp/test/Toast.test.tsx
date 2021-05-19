import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { Toast } from '../src/components/Toast'
import { useAppDispatch } from '../src/hooks'
import { TestProvider } from './TestProvider'

jest.mock('../src/hooks', () => ({
  useAppSelector: jest.requireActual('../src/hooks').useAppSelector,
  useAppDispatch: jest.fn(),
}))

describe('<Toast />', () => {
  it('does not render if is closed', () => {
    render(
      <TestProvider preloadedState={{ notification: { isOpen: false, message: '', toastType: 'SUCCESS' } }}>
        <Toast />
      </TestProvider>
    )
    expect(screen.queryByText('message')).not.toBeInTheDocument()
  })

  it('renders a success toast', () => {
    render(
      <TestProvider preloadedState={{ notification: { isOpen: true, message: 'message', toastType: 'SUCCESS' } }}>
        <Toast />
      </TestProvider>
    )
    screen.getByText('message')
    expect(screen.getByTestId('toast-color')).toHaveClass('bg-green-500')
  })

  it('renders a failure toast', () => {
    render(
      <TestProvider preloadedState={{ notification: { isOpen: true, message: 'message', toastType: 'FAILURE' } }}>
        <Toast />
      </TestProvider>
    )
    screen.getByText('message')
    expect(screen.getByTestId('toast-color')).toHaveClass('bg-red-500')
  })

  it('closes the toast', () => {
    const mockDispatch = jest.fn()
    mocked(useAppDispatch).mockReturnValue(mockDispatch)
    render(
      <TestProvider preloadedState={{ notification: { isOpen: true, message: 'message', toastType: 'SUCCESS' } }}>
        <Toast />
      </TestProvider>
    )
    fireEvent.click(screen.getByTitle('Close toast'))
    expect(mockDispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'notification/setIsOpen',
    })
  })
})
