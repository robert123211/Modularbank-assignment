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
  CORRECT_PAYMENT_BODY_WITH_E2E_ID,
  CORRECT_TRANSACTION_BODY,
  PAYMENT_AMOUNT_NOT_POSITIVE_BODY,
  PAYMENT_AMOUNT_NOT_SET_BODY,
  PAYMENT_BODY_WITHOUT_REF_AND_DETAILS,
  PAYMENT_COUNTER_PARTY_IBAN_BIC_NOT_FOUND,
  PAYMENT_COUNTER_PARTY_IBAN_INVALID,
  PAYMENT_COUNTER_PARTY_IBAN_MISSING_BODY,
  PAYMENT_COUNTER_PARTY_NAME_MISSING_BODY,
  PAYMENT_CURRENCY_CODE_NOT_SET_BODY,
  PAYMENT_INVALID_END_TO_END_ID_BODY,
  PAYMENT_REFERENCE_NUMBER_INVALID_BODY,
  PAYMENT_TYPE_CODE_INVALID_BODY,
  PAYMENT_WITH_CONTRACT_SOURCE_NAME_MISSING_BODY,
  PAYMENT_WITH_CONTRACT_SOURCE_NUMBER_MISSING_BODY, PAYMENT_WITH_CONTRACT_SOURCE_REF_MISSING_BODY,
  PAYMENT_WITHOUT_SOURCE_NAME_BODY,
  PAYMENT_WITHOUT_SOURCE_REF_BODY
} from '../../constants/account-const'
import { ACCOUNT_ERRORS } from '../../constants/error-const'

describe('Create account API tests', () => {
  beforeEach(() => {
    cy.authenticate()
  })

  it('Payment should be made and seen in balance, if it is created and confirmed', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, CORRECT_CUSTOMER_BODY)
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)

        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId

            createTransaction(accountId, POST_HEADERS, CORRECT_TRANSACTION_BODY)
              .then((resp) => {
                const balance = resp.body.data[1].amount - resp.body.data[0].amount

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
                const balance = resp.body.data[1].amount - resp.body.data[0].amount
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

  it('Should not be able to create payment if payment amount is not set', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_AMOUNT_NOT_SET_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_AMOUNT_NOT_SET)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if payment currency code is not set', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_CURRENCY_CODE_NOT_SET_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_CURRENCY_CODE_NOT_SET)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if payment amount is not positive', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_AMOUNT_NOT_POSITIVE_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_AMOUNT_NOT_POSITIVE)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if counter party iban is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_COUNTER_PARTY_IBAN_MISSING_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.COUNTER_PARTY_IBAN_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if counter party name is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_COUNTER_PARTY_NAME_MISSING_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.COUNTER_PARTY_NAME_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if counter party IBAN BIC is not found', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_COUNTER_PARTY_IBAN_BIC_NOT_FOUND)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.COUNTER_PARTY_IBAN_BIC_NOT_FOUND)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if counter party IBAN is invalid', () => {
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
              .then(() => {
                createPayment(accountId, POST_HEADERS, PAYMENT_COUNTER_PARTY_IBAN_INVALID)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.COUNTER_PARTY_IBAN_INVALID)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  // TODO: payment details missing is never thrown, only payment details or ref is missing - improvement
  it('Should not be able to create payment if payment details are missing', () => {})

  it('Should not be able to create payment if contract number is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_WITH_CONTRACT_SOURCE_NUMBER_MISSING_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.CONTRACT_NUMBER_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if contract source name is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_WITH_CONTRACT_SOURCE_NAME_MISSING_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.CONTRACT_SOURCE_NAME_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if contract source ref is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_WITH_CONTRACT_SOURCE_REF_MISSING_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.CONTRACT_SOURCE_REF_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })

  it('Should not be able to create payment if source name is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_WITHOUT_SOURCE_NAME_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_SOURCE_NAME_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if source ref is missing', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_WITHOUT_SOURCE_REF_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_SOURCE_REF_MISSING)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })
  it('Should not be able to create payment if payment type code is invalid', () => {
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
                createPayment(accountId, POST_HEADERS, PAYMENT_TYPE_CODE_INVALID_BODY)
                  .then((resp) => {
                    expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_TYPE_CODE_INVALID)
                    expect(resp.status).to.eq(400)
                  })
              })
          })
      })
  })

  it('Should not be able to create payment if user has insufficient funds', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createPayment(accountId, POST_HEADERS, CORRECT_PAYMENT_BODY)
              .then((resp) => {
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.INSUFFICIENT_FUNDS)
                expect(resp.status).to.eq(400)
              })
          })
      })
  })
  it('Should not be able to create payment if end to end id is invalid', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createPayment(accountId, POST_HEADERS, PAYMENT_INVALID_END_TO_END_ID_BODY)
              .then((resp) => {
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_END_TO_END_ID_INVALID)
                expect(resp.status).to.eq(400)
              })
          })
      })
  })
  // TODO: no information for invalid currencies
  it.skip('Should not be able to create payment if currency is invalid for SEPA payment', () => {

  })

  it('Should not be able to create payment if reference number is invalid', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createPayment(accountId, POST_HEADERS, PAYMENT_REFERENCE_NUMBER_INVALID_BODY)
              .then((resp) => {
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_REFERENCE_NUMBER_INVALID)
                expect(resp.status).to.eq(400)
              })
          })
      })
  })

  // TODO: Documentation needed for reference number length
  it.skip('Should not be able to create payment if reference number length is invalid', () => {})

  // TODO: Documentation needed for Reference number pattern
  it.skip('Should not be able to create payment if reference number pattern is invalid', () => {})

  it('Should not be able to create payment if end to end id is duplicated', () => {
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
                createPayment(accountId, POST_HEADERS, CORRECT_PAYMENT_BODY_WITH_E2E_ID)
                  .then((resp) => {
                    createPayment(accountId, POST_HEADERS, CORRECT_PAYMENT_BODY_WITH_E2E_ID)
                      .then((resp) => {
                        expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_END_TO_END_ID_DUPLICATE)
                        expect(resp.status).to.eq(400)
                      })
                  })
              })
          })
      })
  })

  it('Should not be able to create payment if payment details or ref is missing', () => {
    setHeadersAuthToken()

    createCustomer(POST_HEADERS, createRandomCustomerBody())
      .then((resp) => {
        const personId = resp.body.data.personId
        const personName = resp.body.data.name
        const reqBody = CORRECT_ACCOUNT_BODY(personId, personName)
        createAccount(personId, POST_HEADERS, reqBody)
          .then((resp) => {
            const accountId = resp.body.data.accountId
            createPayment(accountId, POST_HEADERS, PAYMENT_BODY_WITHOUT_REF_AND_DETAILS)
              .then((resp) => {
                expect(resp.body.errors[0]).to.eq(ACCOUNT_ERRORS.PAYMENT_REF_OR_DETAILS_MISSING)
                expect(resp.status).to.eq(400)
              })
          })
      })
  })

  // TODO: No documentation or examples of request body's for performing next actions
  it.skip('Should not be able to create payment if payment confirmation is not allowed', () => {})
  it.skip('Should not be able to create payment if account limit is exceeded', () => {})
  it.skip('Should not be able to create payment if reservation currency change is not allowed', () => {})
})
