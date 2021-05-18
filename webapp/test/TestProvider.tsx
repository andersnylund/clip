import { configureStore } from '@reduxjs/toolkit'
import { FC } from 'react'
import { Provider } from 'react-redux'
import notificationReducer from '../src/notifications/notification-reducer'
import { RootState, store as prodStore } from '../src/store'

const createStore = (preloadedState?: RootState) =>
  configureStore({
    reducer: {
      notification: notificationReducer,
    },
    preloadedState,
  })

export let store: typeof prodStore

export const TestProvider: FC<{ preloadedState?: RootState }> = ({ children, preloadedState }) => {
  store = createStore(preloadedState)
  return <Provider store={store}>{children}</Provider>
}
