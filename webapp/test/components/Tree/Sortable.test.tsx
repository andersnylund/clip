import jestFetchMock from 'jest-fetch-mock'
import { mocked } from 'ts-jest/utils'
import { updateClip } from '../../../src/components/Tree/SortableTree'

describe('<SortableTree />', () => {
  beforeAll(jestFetchMock.enableMocks)

  beforeEach(() => {
    const mockFetch = mocked(fetch)
    mockFetch.mockClear()
  })

  it('calls updates clip', async () => {
    await updateClip({ clipId: 'activeId', index: 0, parentId: 'parentId' })
    expect(fetch).toHaveBeenCalledWith('/api/clip/activeId', {
      body: JSON.stringify({ parentId: 'parentId', index: 0 }),
      headers: { 'Content-Type': 'application/json' },
      method: 'PUT',
    })
  })
})
