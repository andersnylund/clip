import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type LoadingState = 'INITIAL' | 'LOADING' | 'SUCCESS' | 'FAILURE'

interface InitialState {
  exportState: LoadingState
  importState: LoadingState
}

const initialState: InitialState = {
  exportState: 'INITIAL',
  importState: 'INITIAL',
}

const importExportSlice = createSlice({
  name: 'importExport',
  initialState,
  reducers: {
    setImportExportState: (state, action: PayloadAction<{ key: keyof InitialState; state: LoadingState }>) => {
      state[action.payload.key] = action.payload.state
    },
  },
})

export const { setImportExportState } = importExportSlice.actions
export default importExportSlice.reducer
