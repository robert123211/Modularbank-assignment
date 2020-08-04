import {
  createAccount,
  createCustomer,
  getAccountBalance,
  setHeadersAuthToken
} from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import { CORRECT_ACCOUNT_BODY, CORRECT_CUSTOMER_BODY } from '../../constants/account-const'

describe('Create account API tests', () => {
  it('Should get balance of an account, when entering correct headers and account id', () => {
    cy.authenticate().then(() => {
      setHeadersAuthToken()

      createCustomer(POST_HEADERS, CORRECT_CUSTOMER_BODY)
        .then((resp) => {
          const personId = resp.body.data.personId
          const personName = resp.body.data.name
          const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
          createAccount(personId, POST_HEADERS, reqBody)
            .then((resp) => {
              const accountId = resp.body.data.accountId
              getAccountBalance(accountId, GET_HEADERS)
                .then((resp) => {
                  expect(resp.status).to.eq(200)
                  expect(resp.body.data).to.not.be.empty
                  expect(resp.body.data[0].accountId).to.eq(accountId)
                })
            })
        })
    })
  })

  // TODO: No documentation for get request with currency code
  it.skip('Should not be able to get balance when currency code is not supported', () => {})
})
