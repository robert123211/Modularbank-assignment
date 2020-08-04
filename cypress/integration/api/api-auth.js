import { confirmPayment, createAccount, createPayment, createTransaction, getAccountBalance } from '../../utils/account'
import { GET_HEADERS, POST_HEADERS } from '../../constants/authentication-const'
import {
  CORRECT_ACCOUNT_BODY, CORRECT_PAYMENT_BODY,
  CORRECT_TRANSACTION_BODY,
  randomId,
  randomPersonName
} from '../../constants/account-const'

describe('User authentication tests', () => {

  it('Should not be able to get balance when user is not authorized', () => {
    getAccountBalance(randomId, GET_HEADERS)
      .then((resp) => {
        expect(resp.status).to.eq(401)
      })
  })

  it('Should not be able to create account when user is not authorized', () => {
    createAccount(randomId, POST_HEADERS, CORRECT_ACCOUNT_BODY(randomId, randomPersonName))
      .then((resp) => {
        expect(resp.status).to.eq(401)
      })
  })

  it('Should not be able to create a transaction when user is not authorized', () => {
    createTransaction(randomId, POST_HEADERS, CORRECT_TRANSACTION_BODY)
      .then((resp) => {
        expect(resp.status).to.eq(401)
      })
  })

  it('Should not be able to create and confirm a payment when user is not authorized', () => {
    createPayment(randomId, POST_HEADERS, CORRECT_PAYMENT_BODY)
      .then((resp) => {
        expect(resp.status).to.eq(401)
        confirmPayment(randomId, randomId, POST_HEADERS).then(() => {
          expect(resp.status).to.eq(401)
        })
      })
  })
})
