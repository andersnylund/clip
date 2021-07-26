describe('/profile', () => {
  describe('username modifications', () => {
    beforeEach(() => {
      chai.config.truncateThreshold = 0
      cy.setCookie('next-auth.session-token', 'sessionToken')
      cy.task('db:teardown')
      cy.task('db:new-user')
    })

    afterEach(() => {
      cy.task('db:teardown')
    })

    it('shows the username prompt', () => {
      cy.visit('/profile')
      cy.findByText(/Set an username for yourself/)
      cy.findByText(/Logged in as/)
      cy.title().should('equal', 'clip.so – Your profile')
      cy.findByText('Sign out')
    })

    it('updates the username', () => {
      cy.visit('/profile')

      cy.intercept('POST', 'http://localhost:3001/api/profile').as('updateProfile')

      cy.findByPlaceholderText(/Username/).type('fancy new username')
      cy.findByText('Set').click()

      cy.wait('@updateProfile').its('request.body').should('deep.equal', { username: 'fancy new username' })

      cy.findAllByText(/fancy new username/)
      cy.findByText('Sign out')
      cy.findByText('cypress@domain.com')

      cy.findByTitle('Update username').click()
      cy.findByDisplayValue('fancy new username').clear().type('even fancier')
      cy.findByText('Set').click()

      cy.wait('@updateProfile').its('request.body').should('deep.equal', { username: 'even fancier' })
    })
  })

  describe('profile deletion', () => {
    beforeEach(() => {
      chai.config.truncateThreshold = 0
      cy.setCookie('next-auth.session-token', 'sessionToken')
      cy.task('db:teardown')
      cy.task('db:seed')
    })

    afterEach(() => {
      cy.task('db:teardown')
    })

    it('closes the modal if deletion cancelled', () => {
      cy.visit('/profile')

      cy.findByText('Delete your profile').click()
      cy.findByText(/Are you sure you want to delete your profile?/)
      cy.findByText('No').click()

      cy.findByText('cypress@domain.com')
    })

    it('allows to completely delete the profile', () => {
      cy.visit('/profile')

      cy.intercept('DELETE', 'http://localhost:3001/api/profile').as('deleteProfile')

      cy.findByText('Delete your profile').click()
      cy.findByText(/Are you sure you want to delete your profile?/)
      cy.findByText('Yes').click()

      cy.wait('@deleteProfile').its('request.method').should('eq', 'DELETE')

      cy.findByText('Sign in')
    })
  })

  describe('sync switch', () => {
    beforeEach(() => {
      chai.config.truncateThreshold = 0
      cy.setCookie('next-auth.session-token', 'sessionToken')
      cy.task('db:teardown')
      cy.task('db:new-user')
    })

    afterEach(() => {
      cy.task('db:teardown')
    })

    it('shows a sync switch that can be toggled', () => {
      cy.visit('/profile')
      cy.findByLabelText('Enable cross browser syncing')
    })
  })
})

export {}
