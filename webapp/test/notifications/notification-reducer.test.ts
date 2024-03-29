import { showToast } from '../../src/notifications/notification-reducer'

describe('notification-reducer', () => {
  describe('showToast', () => {
    it('dispatches the correct actions', async () => {
      jest.useFakeTimers()
      const dispatch = jest.fn()
      const asyncThunk = showToast({ message: 'message', type: 'SUCCESS' })
      asyncThunk(dispatch, jest.fn(), {})
      jest.runAllTimers()
      expect(dispatch).toHaveBeenCalledTimes(5)
      expect(dispatch).nthCalledWith(
        1,
        expect.objectContaining({
          payload: undefined,
          type: 'SHOW_TOAST/pending',
        })
      )
      expect(dispatch).nthCalledWith(2, { payload: 'message', type: 'notification/setMessage' })
      expect(dispatch).nthCalledWith(3, { payload: 'SUCCESS', type: 'notification/setType' })
      expect(dispatch).nthCalledWith(4, { payload: true, type: 'notification/setIsOpen' })
      expect(dispatch).nthCalledWith(5, { payload: false, type: 'notification/setIsOpen' })
    })
  })
})
