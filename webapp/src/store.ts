import { configureStore } from '@reduxjs/toolkit'
import importExportReducer from './import-export/import-export-reducer'
import notificationReducer from './notifications/notification-reducer'

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
    importExport: importExportReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
