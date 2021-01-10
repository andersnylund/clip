import { DEFAULT_PAGE_TITLE } from '../../src/pages/_document'

describe('document', () => {
  it('exports default page title', () => {
    expect(DEFAULT_PAGE_TITLE).toEqual('clip.so – Share your clips')
  })
})
