// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
import { createRequestWithBody } from '../utils/requests'
import {
  AUTH_BASE_URL,
  AUTH_HEADERS,
  AUTH_PAYLOAD
} from '../constants/authentication-const'
import 'cypress-localstorage-commands'

Cypress.Commands.add('authenticate', () => {
  createRequestWithBody('POST', AUTH_BASE_URL, AUTH_HEADERS, AUTH_PAYLOAD)
    .its('body')
    .then((body) => {
      cy.setLocalStorage('token', body.data.token)
      cy.saveLocalStorage()
    })
})
