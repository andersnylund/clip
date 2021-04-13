/// <reference types="cypress" />

import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
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
