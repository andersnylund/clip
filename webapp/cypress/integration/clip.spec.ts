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

  it('creates a new folder', () => {
    cy.findByText('Your profile')
    cy.findByPlaceholderText('Title').type('my folder')
    cy.findByText('Add folder').click()
    cy.findByText('my folder')
  })

  it('creates a new clip', () => {
    cy.visit('/clips')
    cy.findByPlaceholderText('Title').type('google')
    cy.findByPlaceholderText('URL').type('https://google.com')
    cy.findByText('Add clip').click()
    cy.findByText('google')
  })

  it('reorders two clips', () => {
    cy.findByText('Your profile')
    cy.findByPlaceholderText('Title').type('my folder1')
    cy.findByText('Add folder').click()
    cy.findByText('my folder1')

    cy.findByText('Your profile')
    cy.findByPlaceholderText('Title').type('my folder2')
    cy.findByText('Add folder').click()
    cy.findByText('my folder2')

    cy.findByTestId('handle-my folder2').focus().type(' ').type('{upArrow}').type(' ')

    cy.findAllByText(/my folder/)
      .eq(0)
      .should('have.text', 'my folder2')
    cy.findAllByText(/my folder/)
      .eq(1)
      .should('have.text', 'my folder1')
  })
})

export {}
