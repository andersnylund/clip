describe('frontpage', () => {
  it('shows the expected elements', () => {
    cy.visit('/')
    cy.findAllByText(/clip.so/)
    cy.title().should('equal', 'clip.so – Cross browser bookmarks')
    cy.findByText('Sign in')
  })
})

export {}
