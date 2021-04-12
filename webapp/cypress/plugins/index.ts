/// <reference types="cypress" />

import { seed, teardown } from './prisma-seed'

const plugin: Cypress.PluginConfig = (on) => {
  on('task', {
    'db:seed': async () => {
      return await seed()
    },
    'db:teardown': async () => {
      return await teardown()
    },
  })
}

export default plugin
