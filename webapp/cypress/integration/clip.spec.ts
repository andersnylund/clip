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
    cy.findByPlaceholderText('Title').type('my folder')
    cy.findByText('Add folder').click()
    cy.findByText('my folder')

    // create clip
    cy.findByPlaceholderText('Title').type('google')
    cy.findByPlaceholderText('URL').type('https://google.com')
    cy.findByText('Add clip').click()
    cy.findByText('google')

    // re-orders the clips
    cy.findByTestId('handle-google').focus().type(' ').type('{upArrow}').type(' ')
    cy.findAllByTestId(/clip-header/)
      .eq(0)
      .should('have.text', 'google')
    cy.findAllByTestId(/clip-header/)
      .eq(1)
      .should('have.text', 'my folder')

    // does not allow to set folder as child of clip
    cy.findByTestId('handle-my folder').focus().type(' ').type('{rightArrow}').type(' ')
    cy.findAllByTestId(/clip-header/)
      .eq(0)
      .should('have.text', 'google')
    cy.findAllByTestId(/clip-header/)
      .eq(1)
      .should('have.text', 'my folder')

    // allows to set clip as child of folder
    cy.intercept('GET', 'http://localhost:3001/api/profile').as('getAccount')
    cy.findByTestId('handle-google').focus().type(' ').type('{downArrow}').type('{rightArrow}').type(' ')
    cy.findByText('my folder').should('exist')
    cy.findByText('google').should('not.exist')
    cy.wait('@getAccount')

    // opens the folder from the chevron
    cy.findByTitle('Toggle collapse').click()
    cy.findByText('google').should('be.visible')

    // create a third folder
    cy.findByPlaceholderText('Title').type('second folder')
    cy.findByText('Add folder').click()
    cy.findByText('second folder')
  })
})

export {}
