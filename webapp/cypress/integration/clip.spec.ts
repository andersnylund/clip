describe('/clips', () => {
  beforeEach(() => {
    cy.setCookie('next-auth.session-token', 'sessionToken')
    cy.task('db:teardown')
    cy.task('db:seed')
    cy.visit('/clips')
  })

  afterEach(() => {
    cy.task('db:teardown')
  })

  it('makes actions on the clips page', () => {
    // create folder
    cy.findByText('Your profile')
    cy.findByPlaceholderText('Title').type('my folder')
    cy.findByText('Add folder').click()
    cy.findByText('my folder')

    // create clip
    cy.findByPlaceholderText('Title').type('google')
    cy.findByPlaceholderText('URL').type('https://google.com')
    cy.findByText('Add clip').click()
    cy.findByText('google')

    cy.intercept('GET', 'http://localhost:3001/api/profile', (req) => {
      req.continue((res) => {
        expect(res.body.clips[0].title).to.equal('google')
        expect(res.body.clips[0].index).to.equal(0)
        expect(res.body.clips[1].title).to.equal('my folder')
        expect(res.body.clips[1].index).to.equal(1)
      })
    }).as('getProfile')

    // re-orders the clips
    cy.findByTestId('handle-google').focus().type(' ').type('{upArrow}').type(' ')

    cy.wait('@getProfile')
  })
})

export {}
