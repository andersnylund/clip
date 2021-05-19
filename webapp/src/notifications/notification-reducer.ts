import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type TOAST_TYPE = 'SUCCESS' | 'FAILURE'

interface InitialState {
  isOpen: boolean
  message: string
  toastType: TOAST_TYPE
}

const initialState: InitialState = {
  isOpen: false,
  message: '',
  toastType: 'SUCCESS',
}

export const showToast = createAsyncThunk(
  'SHOW_TOAST',
  async (message: string, { dispatch }) =>
    new Promise<void>((resolve) => {
      dispatch(setMessage(message))
      dispatch(setIsOpen(true))
      setTimeout(() => {
        dispatch(setIsOpen(false))
        resolve()
      }, 5000)
    })
)

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setMessage: (state, action: PayloadAction<string>) => {
      state.message = action.payload
    },
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
  },
})

export const { setIsOpen, setMessage } = notificationSlice.actions
export default notificationSlice.reducer
