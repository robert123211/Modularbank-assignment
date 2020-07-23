import {
  assertPaymentValues,
  confirmPayment,
  createAccount,
  createCustomer, createPayment, createRandomCustomerBody, createTransaction, getAccountBalance,
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

    createCustomer(POST_HEADERS, createRandomCustomerBody())
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
                    getAccountBalance(accountId, GET_HEADERS)
                      .then((resp) => {
                        expect(resp.body.data[0].availableBalanceAmount.toString()).to.eq((balance).toFixed(2))
                        expect(resp.body.data[0].reservedAmount).to.eq(0)
                      })
                  })
              })
          })
      })
  })

  it('Should not be able to create payment if user is not authorized', () => {})
  it('Should not be able to create payment if user is missing', () => {})
  it('Should not be able to create payment if account is missing', () => {})
  it('Should not be able to create payment if payment amount is not set', () => {})
  it('Should not be able to create payment if payment currency code is not set', () => {})
  it('Should not be able to create payment if payment amount is not positive', () => {})
  it('Should not be able to create payment if counter party iban is missing', () => {})
  it('Should not be able to create payment if counter party name is missing', () => {})
  it('Should not be able to create payment if counter party IBAN BIC is not found', () => {})
  it('Should not be able to create payment if payment details are missing', () => {})
  it('Should not be able to create payment if not SEPA active participant', () => {})
  it('Should not be able to create payment if contract number is missing', () => {})
  it('Should not be able to create payment if contract source name is missing', () => {})
  it('Should not be able to create payment if contract source ref is missing', () => {})
  it('Should not be able to create payment if source name is missing', () => {})
  it('Should not be able to create payment if source ref is missing', () => {})
  it('Should not be able to create payment if payment type code is invalid', () => {})
  it('Should not be able to create payment if payment is not allowed', () => {})
  it('Should not be able to create payment if user has insufficient funds', () => {})
  it('Should not be able to create payment if end to end id is invalid', () => {})
  it('Should not be able to create payment if currency is invalid for SEPA payment', () => {})
  it('Should not be able to create payment if payment counter party iban is invalid', () => {})
  it('Should not be able to create payment if reference number is invalid', () => {})
  it('Should not be able to create payment if reference number length is invalid', () => {})
  it('Should not be able to create payment if reference number pattern is invalid', () => {})
  it('Should not be able to create payment if end to end id is duplicated', () => {})
  it('Should not be able to create payment if payment details or ref is missing', () => {})
  it('Should not be able to create payment if payment confirmation is not allowed', () => {})
  it('Should not be able to create payment if account limit is exceeded', () => {})
  it('Should not be able to create payment if reservation currency change is not allowed', () => {})
})
