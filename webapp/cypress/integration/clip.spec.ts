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
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')
    cy.findByText('My folder').should('exist')
    cy.findByText('Google').should('not.exist')
    cy.findByTitle('Toggle collapse').should('exist')

    cy.findAllByTestId(/clip-header/).should('have.length', 1)
  })

  it('opens the folder from the chevron', () => {
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')
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

  it('orders clips correctly', () => {
    // create a third folder
    cy.findByPlaceholderText('Title').type('Third folder')
    cy.findByText('Add folder').click()
    cy.findByText('Third folder')

    // create a Fourth folder
    cy.findByPlaceholderText('Title').type('Fourth folder')
    cy.findByText('Add folder').click()
    cy.findByText('Fourth folder')

    // set clip as child of folder
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')

    // change order of third and fourth
    cy.findAllByTestId('handle-Fourth folder').focus().type(' ').type('{upArrow}').type(' ')

    cy.wait(100)

    cy.findAllByTestId(/clip-header/)
      .eq(1)
      .should('have.text', 'Fourth folder')
    cy.findAllByTestId(/clip-header/)
      .eq(2)
      .should('have.text', 'Third folder')
  })

  it('orders nested clips correctly', () => {
    // create a third clip
    cy.findByPlaceholderText('Title').type('Bing')
    cy.findByPlaceholderText('URL').type('https://bing.com')
    cy.findByText('Add clip').click()
    cy.findByText('Bing')

    // move clips under folder "My folder"
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')
    cy.findByTestId('handle-Bing').focus().type(' ').type('{rightArrow}').type(' ')

    // open My folder
    cy.findByTitle('Toggle collapse').click()
    cy.findByTestId('handle-Bing').focus().type(' ').type('{rightArrow}').type('{upArrow}').type(' ')

    cy.wait(100)

    cy.findByTitle('Toggle collapse').then(() => {
      cy.findAllByTestId(/clip-header/)
        .eq(1)
        .should('have.text', 'Bing')
      cy.findAllByTestId(/clip-header/)
        .eq(2)
        .should('have.text', 'Google')
    })
  })

  it('does not allow to set anything as child of a clip', () => {
    cy.findByTestId('handle-My folder').focus().type(' ').type('{downArrow}').type(' ').type('{rightArrow}')
    cy.findByTitle('Toggle collapse').should('not.exist')
  })

  it('allows to rename a folder', () => {
    cy.findAllByTitle('Edit').eq(0).click()
    cy.findByDisplayValue('My folder').clear().type('{backSpace}').type('Edited folder name')
    cy.findByText('Save').click()
    cy.findByText('Edited folder name')
  })

  it('allows to delete a clip', () => {
    cy.findAllByTitle('Remove').eq(0).click()
    cy.findAllByTestId(/clip-header/).should('have.length', 1)
  })

  it('allows to delete clips recursively', () => {
    // move clips under folder "My folder"
    cy.findByTestId('handle-Google').focus().type(' ').type('{rightArrow}').type(' ')
    cy.findAllByTitle('Remove').eq(0).click()
    cy.findAllByTestId(/clip-header/).should('have.length', 1)
  })

  it('allows edit clip title and url', () => {
    cy.findAllByTitle('Edit').eq(1).click()
    cy.findAllByDisplayValue('Google').clear().type('Bing')
    cy.findAllByDisplayValue('https://google.com').clear().type('https://bing.com')
    cy.findByText('Save').click()
    cy.findByText('Bing')
  })
})

export {}
