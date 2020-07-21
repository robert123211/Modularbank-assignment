import 'cypress-localstorage-commands'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import { createCustomer, assertAccountValues, createAccount, getAccount, setHeadersAuthToken } from '../../utils/account.js'
import { CORRECT_ACCOUNT_BODY, CORRECT_CUSTOMER_BODY } from '../../constants/account-const'

describe('Create account API tests', () => {
  before(() => {
    cy.authenticate()
    cy.saveLocalStorage()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  it('Should Create an Account with Correct Body and Headers', () => {
    let personId
    let personName
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, CORRECT_CUSTOMER_BODY)
      .then((resp) => {
        expect(resp.status).to.eq(200)
        personId = resp.body.data.personId
        personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            assertAccountValues(reqBody, resp)
            const accountId = resp.body.data.accountId
            getAccount(accountId, GET_HEADERS)
              .then((resp) => {
                assertAccountValues(reqBody, resp)
              })
          })
      })
  })
})
