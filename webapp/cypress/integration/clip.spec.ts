import { Clip } from '@prisma/client'
import chaiSubset from 'chai-subset'

chai.use(chaiSubset)

describe('/clips', () => {
  beforeEach(() => {
    chai.config.truncateThreshold = 0
    cy.setCookie('next-auth.session-token', 'sessionToken')
    cy.task('db:teardown')
    cy.task('db:seed')
    cy.visit('/clips', {
      onBeforeLoad: (win) => cy.spy(win, 'postMessage').as('postMessage'),
    })
  })

  afterEach(() => {
    cy.task('db:teardown')
  })

  it('creates a folder', () => {
    cy.findByPlaceholderText('Title').type('New folder here')
    cy.findByText('Add folder').click()
    cy.findByText('New folder here')
  })

  it('does not allow to submit with empty title', () => {
    cy.findByText('Add folder').click()
    cy.findByRole('alert', { name: 'Title is required' }).should('have.text', 'Title is required')
  })

  it('does not allow to submit invalid url', () => {
    cy.findByPlaceholderText('Title').type('New clip here')
    cy.findByPlaceholderText('URL').type('invalid url')
    cy.findByText('Add clip').click()
    cy.findByRole('alert', { name: 'Invalid url' }).should('have.text', 'Invalid url')
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

  it('opens and closes the import modal', () => {
    cy.findByText(/Import/).click()
    cy.findByText('Importing bookmarks from bookmarks bar will overwrite your clip bookmarks')
    cy.findByText('Cancel').click()
  })

  it('shows import success toast', () => {
    cy.intercept('http://localhost:3001/api/clips/import').as('postImportClips')

    cy.findByText(/Import/).click()
    cy.findByText(/Import and overwrite/).click()
    cy.get('@postMessage').should('have.been.calledWith', { type: 'IMPORT_BOOKMARKS' })
    cy.findByTestId('loading-spinner')

    type SimpleClip = Omit<Clip, 'userId'> & {
      clips: SimpleClip[]
    }

    const payload: SimpleClip[] = [
      {
        clips: [],
        collapsed: true,
        id: 'id',
        index: 0,
        parentId: 'parentId',
        title: 'title',
        url: 'url',
      },
    ]

    cy.window().then((win) =>
      win.postMessage({ type: 'IMPORT_BOOKMARKS_SUCCESS', payload }, window.location.toString())
    )

    cy.wait('@postImportClips')
      .its('request.body')
      .should('deep.equal', {
        clips: [
          {
            clips: [],
            collapsed: true,
            id: 'id',
            index: 0,
            parentId: 'parentId',
            title: 'title',
            url: 'url',
          },
        ],
      })
    cy.get('@postImportClips')
      .its('response')
      .then((res) => {
        expect(res.body, 'response.body').to.containSubset([
          {
            title: 'title',
            url: 'url',
            index: 0,
            userId: 1,
            parentId: null,
            collapsed: true,
            clips: [],
          },
        ])
      })

    cy.findByText('Bookmarks imported successfully')
    cy.findByTitle('Close toast').click()
  })

  it('shows import failed toast', () => {
    cy.intercept('http://localhost:3001/api/clips/import').as('postImportClips')

    cy.findByText(/Import/).click()
    cy.findByText(/Import and overwrite/).click()
    cy.get('@postMessage').should('have.been.calledWith', { type: 'IMPORT_BOOKMARKS' })
    cy.findByTestId('loading-spinner')

    cy.window().then((win) => win.postMessage({ type: 'IMPORT_BOOKMARKS_SUCCESS' }, window.location.toString()))

    cy.wait('@postImportClips').its('request.body').should('deep.equal', {})
    cy.findByText('Import failed')
    cy.get('@postImportClips')
      .its('response')
      .then((res) => {
        expect(res.body, 'response.body').to.deep.equal({ error: 'clips are required in the body' })
      })
  })

  it('shows import failed toast if invalid clip structure', () => {
    cy.intercept('http://localhost:3001/api/clips/import').as('postImportClips')

    cy.findByText(/Import/).click()
    cy.findByText(/Import and overwrite/).click()
    cy.get('@postMessage').should('have.been.calledWith', { type: 'IMPORT_BOOKMARKS' })
    cy.findByTestId('loading-spinner')

    cy.window().then((win) =>
      win.postMessage({ type: 'IMPORT_BOOKMARKS_SUCCESS', payload: [{}] }, window.location.toString())
    )

    cy.wait('@postImportClips')
      .its('request.body')
      .should('deep.equal', { clips: [{}] })
    cy.findByText('Import failed')
    cy.findByTitle('Close toast').click()
    cy.get('@postImportClips')
      .its('response')
      .then((res) => {
        expect(res.body, 'response.body').to.deep.equal({ error: 'Internal server error' })
      })
  })

  it('shows the export modal', () => {
    cy.findByText(/Export to bookmark bar/).click()
    cy.findByText('Exporting to bookmarks bar will overwrite all bookmarks')
    cy.findByText('Cancel').click()
  })

  it('exports the bookmarks', () => {
    cy.findByText(/Export to bookmark bar/).click()
    cy.findByText('Exporting to bookmarks bar will overwrite all bookmarks')
    cy.findByText('Export and overwrite').click()
    cy.findByTestId('loading-spinner')

    cy.get('@postMessage').should('have.been.calledWith', {
      type: 'EXPORT_BOOKMARKS',
      payload: [
        {
          id: Cypress.sinon.match.any,
          clips: [],
          collapsed: true,
          index: null,
          parentId: null,
          title: 'My folder',
          url: null,
          userId: 1,
        },
        {
          id: Cypress.sinon.match.any,
          clips: [],
          collapsed: true,
          index: null,
          parentId: null,
          title: 'Google',
          url: 'https://google.com',
          userId: 1,
        },
      ],
    })

    cy.window().then((win) => win.postMessage({ type: 'EXPORT_BOOKMARKS_SUCCESS' }, window.location.toString()))
    cy.findByText('Exported successfully')
    cy.findByTitle('Close toast').click()
  })

  it('shows error toast if export fails', () => {
    cy.findByText(/Export to bookmark bar/).click()
    cy.findByText('Exporting to bookmarks bar will overwrite all bookmarks')
    cy.findByText('Export and overwrite').click()
    cy.findByTestId('loading-spinner')

    cy.get('@postMessage').should('have.been.calledWith', {
      type: 'EXPORT_BOOKMARKS',
      payload: [
        {
          id: Cypress.sinon.match.any,
          clips: [],
          collapsed: true,
          index: null,
          parentId: null,
          title: 'My folder',
          url: null,
          userId: 1,
        },
        {
          id: Cypress.sinon.match.any,
          clips: [],
          collapsed: true,
          index: null,
          parentId: null,
          title: 'Google',
          url: 'https://google.com',
          userId: 1,
        },
      ],
    })

    cy.window().then((win) => win.postMessage({ type: 'EXPORT_BOOKMARKS_ERROR' }, window.location.toString()))
    cy.findByText('Export failed')
    cy.findByTitle('Close toast').click()
  })
})

export {}
