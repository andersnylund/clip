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

  it('creates a folder', () => {
    cy.findByPlaceholderText('Title').type('New folder here')
    cy.findByText('Add folder').click()
    cy.findByText('New folder here')
  })

  it('creates a clip', () => {
    cy.findByPlaceholderText('Title').type('New clip here')
    cy.findByPlaceholderText('URL').type('https://google.com')
    cy.findByText('Add clip').click()
    cy.findByText('New clip here').should('have.attr', 'href', 'https://google.com')
  })

  it('reorders two clips', () => {
    cy.findByTestId('handle-Google').focus().type(' ').type('{upArrow}').type(' ')
    cy.findAllByTestId(/clip-header/)
      .eq(0)
      .should('have.text', 'Google')
    cy.findAllByTestId(/clip-header/)
      .eq(1)
      .should('have.text', 'My folder')
  })

  it('does not allow to set folder as child of clip', () => {
    cy.findByTestId('handle-My folder').focus().type(' ').type('{downArrow}').type('{rightArrow}').type(' ')
    cy.findAllByTestId(/clip-header/)
      .eq(0)
      .should('have.text', 'Google')
    cy.findAllByTestId(/clip-header/)
      .eq(1)
      .should('have.text', 'My folder')
  })

  it('allows to set clip as child of folder', () => {
    cy.intercept('GET', 'http://localhost:3001/api/profile').as('getAccount')
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')
    cy.wait('@getAccount')
    cy.findByText('My folder').should('exist')
    cy.findByText('Google').should('not.exist')

    cy.findAllByTestId(/clip-header/).should('have.length', 1)
  })

  it('opens the folder from the chevron', () => {
    cy.intercept('GET', 'http://localhost:3001/api/profile').as('getAccount')
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')
    cy.wait('@getAccount')
    cy.findByTitle('Toggle collapse').click()
    cy.findByText('Google').should('be.visible')
  })

  it('shows indicator when reordering folder with clips', () => {
    // create a third folder
    cy.findByPlaceholderText('Title').type('Second folder')
    cy.findByText('Add folder').click()
    cy.findByText('Second folder')

    // set clip as child of first folder
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')

    cy.findByTestId('handle-My folder').focus().type(' ').type('{downArrow}')
    cy.findByText('2').should('exist')
    cy.findAllByTestId('handle-My folder').eq(0).type(' ')
    cy.findByText('2').should('not.exist')
  })
})

export {}
