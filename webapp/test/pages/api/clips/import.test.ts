import http from 'http'
import { apiResolver } from 'next/dist/next-server/server/api-utils'
import listen from 'test-listen'

import handler from '../../../../src/pages/api/clips/import'

describe('import', () => {
  let server: http.Server
  let url: string

  beforeAll(async (done) => {
    server = http.createServer((req, res) =>
      apiResolver(
        req,
        res,
        undefined,
        handler,
        { previewModeEncryptionKey: '', previewModeId: '', previewModeSigningKey: '' },
        false
      )
    )
    url = await listen(server)
    done()
  })

  afterAll((done) => {
    server.close(done)
  })

  it('works', async () => {
    const response = await fetch(url)
    console.log('url', url)
    console.log('response', response)
    expect(response.status).toEqual(200)
  })
})
