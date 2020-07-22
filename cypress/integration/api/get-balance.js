import {
  createAccount,
  createCustomer,
  getAccountBalance,
  setHeadersAuthToken
} from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import { CORRECT_ACCOUNT_BODY, CORRECT_CUSTOMER_BODY } from '../../constants/account-const'

describe('Create account API tests', () => {
  before(() => {
    cy.authenticate()
    cy.saveLocalStorage()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  it('Should get balance of an account, when entering correct headers and account id', () => {
    let personId
    let personName
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, CORRECT_CUSTOMER_BODY)
      .then((resp) => {
        personId = resp.body.data.personId
        personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            getAccountBalance(accountId, GET_HEADERS)
              .then((resp) => {
                expect(resp.status).to.eq(200)
                expect(resp.body.data).to.not.be.empty
                // TODO: why that kind of solution??
                expect(resp.body.data[0].accountId).to.eq(accountId)
              })
          })
      })
  })
})
