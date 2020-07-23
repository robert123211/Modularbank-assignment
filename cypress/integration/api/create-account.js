import 'cypress-localstorage-commands'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import { createCustomer, assertAccountValues, createAccount, getAccount, setHeadersAuthToken, createRandomCustomerBody } from '../../utils/account.js'
import {
  CORRECT_ACCOUNT_BODY,
  INVALID_BODY_ACCOUNTTYPE
} from '../../constants/account-const'
import { ACCOUNT_ERRORS } from '../../constants/error-const'

describe('Create account API tests', () => {
  beforeEach(() => {
    cy.authenticate()
  })

  it('Should Create an Account with Correct Body and Headers', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        expect(resp.status).to.eq(200)
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
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

  it('Should not be able to create account if account type is invalid', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        expect(resp.status).to.eq(200)
        const personId = resp.body.data.personId
        const personName = resp.body.data.name

        createAccount(personId, POST_HEADERS, INVALID_BODY_ACCOUNTTYPE(personId, personName))
          .then((resp) => {
            expect(resp.status).to.eq(400)
            expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.ACCOUNT_TYPE_INVALID)
          })
      })
  })

  it('Should not be able to create account if account holder name is invalid', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        expect(resp.status).to.eq(200)
        const personId = resp.body.data.personId

        createAccount(personId, POST_HEADERS, CORRECT_ACCOUNT_BODY(personId, '!"# !"#€'))
          .then((resp) => {
            expect(resp.status).to.eq(400)
            expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.ACCOUNT_TYPE_INVALID)
          })
      })
  })
  it('Should not be able to create account if account residency code is invalid', () => {})
  it('Should not be able to create account if account customer group is invalid', () => {})
  it('Should not be able to create account if account customer group is not active', () => {})
  it('Should not be able to create account if account price list is not active', () => {})
})
