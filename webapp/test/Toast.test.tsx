import { fireEvent, render, screen } from '@testing-library/react'
import { Toast } from '../src/components/Toast'
import { testDispatch, TestProvider, testStore } from './TestProvider'

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
    render(
      <TestProvider preloadedState={{ notification: { isOpen: true, message: 'message', toastType: 'SUCCESS' } }}>
        <Toast />
      </TestProvider>
    )
    fireEvent.click(screen.getByTitle('Close toast'))
    expect(testStore.getState().notification).toEqual({
      isOpen: false,
      message: 'message',
      toastType: 'SUCCESS',
    })
    expect(testDispatch).toHaveBeenCalledWith({
      payload: false,
      type: 'notification/setIsOpen',
    })
  })
})
