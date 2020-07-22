import {
  assertTransactionValues,
  createAccount,
  createCustomer, createTransaction, getAccountBalance,
  setHeadersAuthToken
} from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import { CORRECT_ACCOUNT_BODY, CORRECT_CUSTOMER_BODY, CORRECT_TRANSACTION_BODY } from '../../constants/account-const'

describe('Create account API tests', () => {
  before(() => {
    cy.authenticate()
    cy.saveLocalStorage()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  it('Should create a incoming transaction with balance rising', () => {
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
            createTransaction(accountId, POST_HEADERS, CORRECT_TRANSACTION_BODY)
              .then((resp) => {
                assertTransactionValues(CORRECT_TRANSACTION_BODY, resp)
                const balance = resp.body.data[0].amount - resp.body.data[1].amount
                getAccountBalance(accountId, GET_HEADERS)
                  .then((resp) => {
                    expect(resp.body.data[0].balanceAmount).to.eq(balance)
                  }
                  )
              })
          })
      })
  })
})
