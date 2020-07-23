import { createRequestWithBody, createRequestWithoutBody } from './requests'
import {
  ACCOUNT_GET_URL,
  ACCOUNT_POST_URL,
  BALANCES_GET_URL,
  CUSTOMER_POST_URL, PAYMENTS_CONFIRM_URL, PAYMENTS_INITIALISE_URL,
  TRANSACTIONS_POST_URL
} from '../constants/account-const'
import { GET_HEADERS, POST_HEADERS } from '../constants/authentication-const'
import faker from 'faker'

/**
 * Create customer through API
 * @param headers - Headers sent with the request
 * @param requestBody - Body sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const createCustomer = (headers, requestBody) => {
  return createRequestWithBody('POST', CUSTOMER_POST_URL, headers, requestBody)
}

/**
 * Create account through API
 * @param personId - Unique person identifier
 * @param headers - Headers sent with the request
 * @param requestBody - Body sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const createAccount = (personId, headers, requestBody) => {
  return createRequestWithBody('POST', ACCOUNT_POST_URL(personId), headers, requestBody)
}

/**
 * Create transaction through API
 * @param headers - Headers sent with the request
 * @param accountId - Unique account identifier
 * @param requestBody - Body sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const createTransaction = (accountId, headers, requestBody) => {
  return createRequestWithBody('POST', TRANSACTIONS_POST_URL(accountId), headers, requestBody)
}

/**
 * Create payment through API
 * @param accountId - Unique account identifier
 * @param headers - Headers sent with the request
 * @param requestBody - Body sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const createPayment = (accountId, headers, requestBody) => {
  return createRequestWithBody('POST', PAYMENTS_INITIALISE_URL(accountId), headers, requestBody)
}

/**
 * Confirm payment through API
 * @param accountId - Unique account identifier
 * @param paymentId - Unique payment identifier
 * @param headers - Headers sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const confirmPayment = (accountId, paymentId, headers) => {
  return createRequestWithoutBody('POST', PAYMENTS_CONFIRM_URL(accountId, paymentId), GET_HEADERS)
}

/**
 * Get account by account id
 * @param accountId - Unique account identifier
 * @param headers - Headers sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const getAccount = (accountId, headers) => {
  return createRequestWithoutBody('GET', ACCOUNT_GET_URL(accountId), headers)
}

/**
 * Get account's balance
 * @param accountId - Unique account identifier
 * @param headers - Headers sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const getAccountBalance = (accountId, headers) => {
  return createRequestWithoutBody('GET', BALANCES_GET_URL(accountId), headers)
}

/**
 * Set x-auth-token header, which value is taken from local storage
 */
export const setHeadersAuthToken = () => {
  POST_HEADERS['x-auth-token'] = localStorage.getItem('token')
  GET_HEADERS['x-auth-token'] = localStorage.getItem('token')
}

/**
 * Assert account request's values to response value's to verify if the endpoint is working correctly
 * @param reqBody - Request body
 * @param resp - Response from request
 */
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

/**
 * Assert transaction request's values to response value's to verify if the endpoint is working correctly
 * @param reqBody - Request body
 * @param resp - Response from request
 */
export const assertTransactionValues = (reqBody, resp) => {
  const respBody = resp.body.data[1]

  expect(resp.status).to.eq(200)
  expect(respBody.amount).to.eq(reqBody.money.amount)
  expect(respBody.currencyCode).to.eq(reqBody.money.currencyCode)
  expect(respBody.details).to.eq(reqBody.details)
  expect(respBody.effectiveDate).to.eq(reqBody.effectiveDate)
  expect(respBody.source.sourceName).to.eq(reqBody.source.sourceName)
  expect(respBody.source.sourceRef).to.eq(reqBody.source.sourceRef)
  expect(respBody.transactionTypeCode).to.eq(reqBody.transactionTypeCode)
}

/**
 * Assert payment request's values to response value's to verify if the endpoint is working correctly
 * @param reqBody - Request body
 * @param resp - Response from request
 */
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

/**
 * Create correct customer body for customer request, which involves randomly generated name and phone number
 * @returns {{taxResidencyCountry: string, language: string, educationCode: string, correspondenceAddress: {zip: string, addressTypeCode: string, countryCode: string, stateRegion: string, street1: string, cityCounty: string}, activityCode: string, maritalStatusCode: string, countryOfBirth: string, fixedEmploymentLength: number, pep: boolean, id: (*|boolean), email: string, placeOfBirth: string, address: {zip: string, addressTypeCode: string, moveInDate: string, countryCode: string, stateRegion: string, street1: string, cityCounty: string}, sex: string, personTypeCode: string, birthDate: string, employmentTimeCode: string, buildingTypeCode: string, acitivityCode: string, phoneNumber: Faker.phone.phoneNumber, nationality: string, businessAreaCode: string, usResident: boolean, name: *, identificationNumber: {idCountryCode: string, idNumber: *}, dependantPersons: number}}
 */
export const createRandomCustomerBody = () => {
  return {
    activityCode: 'ACTIVE',
    birthDate: '1978-02-28',
    email: 'qa@modularbank.co',
    id: faker.random.number(100),
    identificationNumber: {
      idCountryCode: 'FI',
      idNumber: faker.phone.phoneNumber()
    },
    name: faker.name.firstName() + faker.name.lastName(),
    personTypeCode: 'P',
    sex: 'M',
    placeOfBirth: 'Helsinki',
    taxResidencyCountry: 'FI',
    buildingTypeCode: 'APARTMENT',
    businessAreaCode: 'FINANCE',
    acitivityCode: 'EMPLOYEE',
    dependantPersons: 1,
    maritalStatusCode: 'SINGLE',
    nationality: 'FI',
    countryOfBirth: 'FI',
    language: 'FI',
    usResident: false,
    pep: false,
    educationCode: 'HIGHER_EDUCATION',
    employmentTimeCode: 'UP_4_YEAR',
    fixedEmploymentLength: 5,
    phoneNumber: faker.phone.phoneNumber,
    address: {
      addressTypeCode: 'R',
      cityCounty: 'Helsinki',
      countryCode: 'FI',
      stateRegion: 'Uusimaa',
      street1: 'Ratamestarinkatu 12',
      zip: '30800101',
      moveInDate: '2018-01-20'
    },
    correspondenceAddress: {
      addressTypeCode: 'C',
      cityCounty: 'Helsinki',
      countryCode: 'FI',
      stateRegion: 'Uusimaa',
      street1: 'Ratamestarinkatu 12',
      zip: '30800101'
    }
  }
}
