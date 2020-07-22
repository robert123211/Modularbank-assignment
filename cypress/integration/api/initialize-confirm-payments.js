import {
  assertPaymentValues,
  confirmPayment,
  createAccount,
  createCustomer, createPayment, createTransaction, getAccountBalance,
  setHeadersAuthToken
} from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import {
  CORRECT_ACCOUNT_BODY,
  CORRECT_CUSTOMER_BODY,
  CORRECT_PAYMENT_BODY,
  CORRECT_TRANSACTION_BODY
} from '../../constants/account-const'

describe('Create account API tests', () => {
  before(() => {
    cy.authenticate()
    cy.saveLocalStorage()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  it('Payment should be made and seen in balance, if it is created and confirmed', () => {
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
                const balance = resp.body.data[0].amount - resp.body.data[1].amount

                createPayment(accountId, POST_HEADERS, CORRECT_PAYMENT_BODY)
                  .then((resp) => {
                    const paymentId = resp.body.data.paymentId

                    assertPaymentValues(CORRECT_PAYMENT_BODY, resp)
                    confirmPayment(accountId, paymentId, GET_HEADERS)
                      .then((resp) => {
                        const paymentAmount = resp.body.data.amount

                        expect(resp.body.data.accountId).to.eq(accountId)
                        expect(resp.body.data.paymentId).to.eq(paymentId)
                        assertPaymentValues(CORRECT_PAYMENT_BODY, resp)
                        getAccountBalance(accountId, GET_HEADERS)
                          .then((resp) => {
                            expect(resp.body.data[0].availableBalanceAmount.toString()).to.eq((balance - paymentAmount).toFixed(2))
                            expect(resp.body.data[0].reservedAmount).to.eq(paymentAmount)
                          })
                      })
                  })
              })
          })
      })
  })

  it('Payment should not be made, if the payment is created, but is not confirmed', () => {
    let personId
    let personName
    setHeadersAuthToken()
  })

  it('Payment should not be made if the account has insufficient funds', () => {
    let personId
    let personName
    setHeadersAuthToken()
  })
})
