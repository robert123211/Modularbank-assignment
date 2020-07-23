import {
  assertTransactionValues,
  createAccount,
  createCustomer, createTransaction, getAccountBalance,
  setHeadersAuthToken
} from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import { CORRECT_ACCOUNT_BODY, CORRECT_CUSTOMER_BODY, CORRECT_TRANSACTION_BODY } from '../../constants/account-const'

describe('Create account API tests', () => {

  beforeEach(() => {
    cy.authenticate()
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
                const balance = resp.body.data[1].amount - resp.body.data[0].amount
                getAccountBalance(accountId, GET_HEADERS)
                  .then((resp) => {
                    expect(resp.body.data[0].balanceAmount).to.eq(balance)
                  }
                  )
              })
          })
      })
  })

  it('Should not be able to create transaction if user is not authorized', () => {})
  it('Should not be able to create transaction if account is not found', () => {})
  it('Should not be able to create transaction if transaction type is invalid', () => {})
  it('Should not be able to create transaction if fee type transaction is zero', () => {})
  it('Should not be able to create transaction if user has insufficient funds', () => {})
})
