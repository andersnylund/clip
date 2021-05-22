import { configureStore } from '@reduxjs/toolkit'
import { FC } from 'react'
import { Provider } from 'react-redux'
import importExportReducer from '../src/import-export/import-export-reducer'
import notificationReducer from '../src/notifications/notification-reducer'
import { RootState, store as prodStore } from '../src/store'

const createStore = (preloadedState?: RootState) =>
  configureStore({
    reducer: {
      notification: notificationReducer,
      importExport: importExportReducer,
    },
    preloadedState,
  })

export let testStore: typeof prodStore

export const TestProvider: FC<{ preloadedState?: Partial<RootState> }> = ({ children, preloadedState }) => {
  testStore = createStore({
    ...prodStore.getState(),
    ...preloadedState,
  })
  return <Provider store={testStore}>{children}</Provider>
}
