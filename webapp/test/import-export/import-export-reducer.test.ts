import reducer, { setImportExportState } from '../../src/import-export/import-export-reducer'

describe('import-export-reducer', () => {
  describe('setImportExportState', () => {
    it('sets the correct state', async () => {
      const initialState = reducer(undefined, { type: '' })
      expect(initialState).toEqual({
        exportState: 'INITIAL',
        importState: 'INITIAL',
      })
      const nextState = reducer(initialState, setImportExportState({ key: 'exportState', state: 'LOADING' }))
      expect(nextState).toEqual({
        exportState: 'LOADING',
        importState: 'INITIAL',
      })
    })
  })
})
