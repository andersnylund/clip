import { waitFor } from '@testing-library/dom'
import { showToast } from '../../src/notifications/notification-reducer'

describe('notification-reducer', () => {
  describe('showToast', () => {
    it('dispatches the correct actions', async () => {
      jest.useFakeTimers()
      const dispatch = jest.fn()
      const asyncThunk = showToast('message')
      asyncThunk(dispatch, jest.fn(), {})
      jest.runAllTimers()
      expect(dispatch).toHaveBeenCalledTimes(4)
      expect(dispatch).nthCalledWith(
        1,
        expect.objectContaining({
          payload: undefined,
          type: 'SHOW_TOAST/pending',
        })
      )
      expect(dispatch).nthCalledWith(2, { payload: 'message', type: 'notification/setMessage' })
      expect(dispatch).nthCalledWith(3, { payload: true, type: 'notification/setIsOpen' })
      expect(dispatch).nthCalledWith(4, { payload: false, type: 'notification/setIsOpen' })
      await waitFor(() => {
        expect(dispatch).toHaveBeenCalledTimes(5)
        expect(dispatch).nthCalledWith(5, expect.objectContaining({ payload: undefined, type: 'SHOW_TOAST/fulfilled' }))
      })
    })
  })
})
