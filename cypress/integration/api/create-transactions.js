import {
  assertTransactionValues,
  createAccount,
  createCustomer, createRandomCustomerBody, createTransaction, getAccountBalance,
  setHeadersAuthToken
} from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import {
  CORRECT_ACCOUNT_BODY,
  CORRECT_TRANSACTION_BODY, INVALID_TRANSACTION_TYPE_BODY,
  randomId, TRANSACTION_BODY_WITH_FEE_TRANSACTION_TYPE_ZERO, TRANSACTION_WITH_INSUFFICIENT_FUNDS_BODY
} from '../../constants/account-const'
import { ACCOUNT_ERRORS } from '../../constants/error-const'

describe('Create account API tests', () => {
  beforeEach(() => {
    cy.authenticate()
  })

  it('Should create a incoming transaction with balance rising', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
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

  it('Should not be able to create transaction if account is not found', () => {
    setHeadersAuthToken()

    createTransaction(randomId, POST_HEADERS, CORRECT_TRANSACTION_BODY)
      .then((resp) => {
        expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.ACCOUNT_NOT_FOUND)
        expect(resp.status).to.eq(400)
      })
  })
  it('Should not be able to create transaction if transaction type is invalid', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createTransaction(accountId, POST_HEADERS, INVALID_TRANSACTION_TYPE_BODY)
              .then((resp) => {
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.TRANSACTION_TYPE_NOT_FOUND)
                expect(resp.status).to.eq(400)
              })
          })
      })
  })

  // TODO: From swagger it seems that it should return 400 while requesting fee type code with zero but no real
  // documentation about it - have to confirm
  it('Should not be able to create transaction if fee transaction type is zero', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createTransaction(accountId, POST_HEADERS, TRANSACTION_BODY_WITH_FEE_TRANSACTION_TYPE_ZERO)
              .then((resp) => {
                expect(resp.status).to.eq(400)
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.FEE_TYPE_ZERO)
              })
          })
      })
  })

  it('Should not be able to create transaction if user has insufficient funds', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createTransaction(accountId, POST_HEADERS, TRANSACTION_WITH_INSUFFICIENT_FUNDS_BODY)
              .then((resp) => {
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.INSUFFICIENT_FUNDS)
                expect(resp.status).to.eq(400)
              })
          })
      })
  })
})
