/// <reference types="cypress" />

import dotenv from 'dotenv'
dotenv.config({ path: '.env.test' })
import { seed, seedNewUser, teardown } from './prisma-seed'

const plugin: Cypress.PluginConfig = (on) => {
  on('task', {
    'db:seed': async () => {
      return await seed()
    },
    'db:new-user': async () => {
      return await seedNewUser()
    },
    'db:teardown': async () => {
      return await teardown()
    },
  })
}

export default plugin
