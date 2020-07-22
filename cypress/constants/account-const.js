import faker from 'faker'
import { getCurrentDateString, getCurrentTimestamp } from '../utils'

export const CUSTOMER_POST_URL = 'https://person-api.sandbox.modularbank.xyz/api/v1/persons'
export const ACCOUNT_BASE_URL = 'https://account-api.sandbox.modularbank.xyz/api/v1'
export const ACCOUNT_POST_URL = (personId) => `${ACCOUNT_BASE_URL}/persons/${personId}/accounts`
export const ACCOUNT_GET_URL = (accountId) => `${ACCOUNT_BASE_URL}/accounts/${accountId}`
export const BALANCES_GET_URL = (accountId) => `${ACCOUNT_BASE_URL}/accounts/${accountId}/balances`
export const TRANSACTIONS_POST_URL = (accountId) => `${ACCOUNT_BASE_URL}/accounts/${accountId}/transactions`
export const PAYMENTS_INITIALISE_URL = (accountId) => `${ACCOUNT_BASE_URL}/accounts/${accountId}/payments/initialise`
export const PAYMENTS_CONFIRM_URL = (accountId, paymentId) => `${ACCOUNT_BASE_URL}/accounts/${accountId}/payments/${paymentId}/confirm`

export const CORRECT_CUSTOMER_BODY = {
  activityCode: 'ACTIVE',
  birthDate: '1978-02-28',
  email: 'qa@modularbank.co',
  id: faker.random.number(100),
  identificationNumber: {
    idCountryCode: 'FI',
    idNumber: faker.phone.phoneNumber()
  },
  name: 'Robert Krikk',
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

export const CORRECT_ACCOUNT_BODY = (personId, personName) => {
  return {
    accountName: 'Demo account',
    accountTypeCode: 'CURRENCY',
    currencyCode: 'EUR',
    customerGroupCode: 'GROUP_A',
    personId: personId,
    personName: personName,
    priceListTypeCode: 'STANDARD',
    residencyCountryCode: 'FI',
    source: {
      sourceName: 'TEST',
      sourceRef: '{{$guid}}'
    }
  }
}

export const CORRECT_TRANSACTION_BODY = {
  details: 'Card topup',
  effectiveDate: getCurrentDateString(),
  money: {
    amount: 238,
    currencyCode: 'EUR'
  },
  source: {
    sourceName: 'CARD_TOPUP',
    sourceRef: `ID-${getCurrentTimestamp()}`
  },
  transactionTypeCode: 'CARD_TOPUP'
}

export const CORRECT_PAYMENT_BODY = {
  counterparty: {
    counterpartyTypeCode: 'IBAN',
    name: 'Ben Ficher',
    value: 'EE459999000000010140'
  },
  details: 'Details',
  directionCode: 'OUT',
  effectiveDate: '2020-06-08',
  endToEndId: 'NOTPROVIDED',
  money: {
    amount: 24.35,
    currencyCode: 'EUR'
  },
  paymentTransferTypeCode: 'INSTANTREGULAR',
  paymentTypeCode: 'ACC2SEPA',
  source: {
    sourceName: 'PAYMENT',
    sourceRef: `ID-${getCurrentTimestamp()}`
  }
}
