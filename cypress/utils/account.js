import { createRequestWithBody, createRequestWithoutBody } from './requests'
import { ACCOUNT_GET_URL, ACCOUNT_POST_URL, CUSTOMER_POST_URL } from '../constants/account-const'
import { GET_HEADERS, POST_HEADERS } from '../constants/authentication-const'

export const createCustomer = (headers, requestBody) => {
  return createRequestWithBody('POST', CUSTOMER_POST_URL, headers, requestBody)
}

export const createAccount = (personId, headers, requestBody) => {
  return createRequestWithBody('POST', ACCOUNT_POST_URL(personId), headers, requestBody)
}

export const getAccount = (accountId, headers) => {
  return createRequestWithoutBody('GET', ACCOUNT_GET_URL(accountId), headers)
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
