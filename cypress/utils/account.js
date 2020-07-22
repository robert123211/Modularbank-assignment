import { createRequestWithBody, createRequestWithoutBody } from './requests'
import {
  ACCOUNT_GET_URL,
  ACCOUNT_POST_URL,
  BALANCES_GET_URL,
  CUSTOMER_POST_URL, PAYMENTS_CONFIRM_URL, PAYMENTS_INITIALISE_URL,
  TRANSACTIONS_POST_URL
} from '../constants/account-const'
import { GET_HEADERS, POST_HEADERS } from '../constants/authentication-const'

export const createCustomer = (headers, requestBody) => {
  return createRequestWithBody('POST', CUSTOMER_POST_URL, headers, requestBody)
}

export const createAccount = (personId, headers, requestBody) => {
  return createRequestWithBody('POST', ACCOUNT_POST_URL(personId), headers, requestBody)
}

export const createTransaction = (accountId, headers, requestBody) => {
  return createRequestWithBody('POST', TRANSACTIONS_POST_URL(accountId), headers, requestBody)
}

export const createPayment = (accountId, headers, requestBody) => {
  return createRequestWithBody('POST', PAYMENTS_INITIALISE_URL(accountId), headers, requestBody)
}

export const confirmPayment = (accountId, paymentId, headers) => {
  return createRequestWithoutBody('POST', PAYMENTS_CONFIRM_URL(accountId, paymentId), GET_HEADERS)
}

export const getAccount = (accountId, headers) => {
  return createRequestWithoutBody('GET', ACCOUNT_GET_URL(accountId), headers)
}

export const getAccountBalance = (accountId, headers) => {
  return createRequestWithoutBody('GET', BALANCES_GET_URL(accountId), headers)
}

export const setHeadersAuthToken = () => {
  POST_HEADERS['x-auth-token'] = localStorage.getItem('token')
  GET_HEADERS['x-auth-token'] = localStorage.getItem('token')
}

export const assertAccountValues = (reqBody, resp) => {
  const respBody = resp.body.data
  expect(resp.status).to.eq(200)
  expect(respBody.personId).to.eq(reqBody.personId)
  expect(respBody.personName).to.eq(reqBody.personName)
  expect(respBody.accountName).to.eq(reqBody.accountName)
  expect(respBody.accountTypeCode).to.eq(reqBody.accountTypeCode)
  expect(respBody.currencyCode).to.eq(reqBody.defaultCurrencyCode)
  expect(respBody.customerGroupCode).to.eq(reqBody.customerGroupCode)
  expect(respBody.residencyCode).to.eq(reqBody.residencyCountryCode)
}

export const assertTransactionValues = (reqBody, resp) => {
  const respBody = resp.body.data[0]

  expect(resp.status).to.eq(200)
  expect(respBody.amount).to.eq(reqBody.money.amount)
  expect(respBody.currencyCode).to.eq(reqBody.money.currencyCode)
  expect(respBody.details).to.eq(reqBody.details)
  expect(respBody.effectiveDate).to.eq(reqBody.effectiveDate)
  expect(respBody.source.sourceName).to.eq(reqBody.source.sourceName)
  expect(respBody.source.sourceRef).to.eq(reqBody.source.sourceRef)
  expect(respBody.transactionTypeCode).to.eq(reqBody.transactionTypeCode)
}

export const assertPaymentValues = (reqBody, resp) => {
  const respBody = resp.body.data

  expect(resp.status).to.eq(200)
  expect(reqBody.counterparty.name).to.eq(respBody.counterpartyName)
  expect(reqBody.counterparty.value).to.eq(respBody.counterpartyIban)
  expect(reqBody.money.amount).to.eq(respBody.amount)
  expect(reqBody.money.currencyCode).to.eq(respBody.currencyCode)
  expect(reqBody.paymentTransferTypeCode).to.eq(respBody.transferType)
  expect(reqBody.paymentTypeCode).to.eq(respBody.paymentTypeCode)
  expect(reqBody.source.sourceName).to.eq(respBody.source.sourceName)
  expect(reqBody.source.sourceRef).to.eq(respBody.source.sourceRef)
  expect(reqBody.effectiveDate).to.eq(respBody.effectiveDate)
}
