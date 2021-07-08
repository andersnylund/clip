describe('get-started', () => {
  it('shows the expected elements', () => {
    cy.visit('/get-started')
    cy.findAllByText(/Create your profile/)
    cy.title().should('equal', 'clip.so – Get Started')
    cy.findByText('Sign in')
  })

  it('links to the correct places on the site', () => {
    cy.visit('/get-started')
    cy.findByText('sign in').should('have.attr', 'href', '/api/auth/signin')
    cy.findByText('clips').should('have.attr', 'href', '/clips')

    cy.findByAltText('Chromium extension')
      .parent()
      .parent()
      .should('have.attr', 'href', 'https://chrome.google.com/webstore/detail/clipso/gjbelnkifheaicnfbekpcjcgnhefdgcf')
    cy.findByAltText('Firefox extension')
      .parent()
      .parent()
      .should('have.attr', 'href', 'https://addons.mozilla.org/en-US/firefox/addon/clip-so')
  })
})

export {}
