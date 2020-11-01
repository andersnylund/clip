import { HttpError } from '../../src/error/http-error'

describe('http error', () => {
  it('works', () => {
    const error = new HttpError('message', 'info', 500)
    expect(error.message).toEqual('message')
    expect(error.info).toEqual('info')
    expect(error.statusCode).toEqual(500)
  })
})
