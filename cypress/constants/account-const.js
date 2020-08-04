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
export const randomPersonName = `${faker.name.firstName()} ${faker.name.lastName()}`
export const randomId = 'random-id-500'

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

export const INVALID_BODY_ACCOUNTTYPE = (personId, personName) => {
  return {
    accountName: 'Demo account',
    accountTypeCode: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
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

export const INVALID_BODY_RESIDENCY = (personId, personName) => {
  return {
    accountName: 'Demo account',
    accountTypeCode: 'CURRENCY',
    currencyCode: 'EUR',
    customerGroupCode: 'GROUP_A',
    personId: personId,
    personName: personName,
    priceListTypeCode: 'STANDARD',
    residencyCountryCode: 'BLABLABLA',
    source: {
      sourceName: 'TEST',
      sourceRef: '{{$guid}}'
    }
  }
}

export const INVALID_BODY_CUSTOMER_GROUP = (personId, personName) => {
  return {
    accountName: 'Demo account',
    accountTypeCode: 'CURRENCY',
    currencyCode: 'EUR',
    customerGroupCode: 'BLABLABLABLABLA',
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

export const INVALID_BODY_PRICE_LIST  = (personId, personName) => {
  return {
    accountName: 'Demo account',
    accountTypeCode: 'CURRENCY',
    currencyCode: 'EUR',
    customerGroupCode: 'GROUP_A',
    personId: personId,
    personName: personName,
    priceListTypeCode: 'BLABLABLABLA!?',
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

export const INVALID_TRANSACTION_TYPE_BODY = {
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
  transactionTypeCode: 'SOME FAKE TRANSACTION TYPE CODE'
}

export const TRANSACTION_WITH_INSUFFICIENT_FUNDS_BODY = {
  details: 'ACC2SEPA PAY',
  effectiveDate: getCurrentDateString(),
  money: {
    amount: 238,
    currencyCode: 'EUR'
  },
  source: {
    sourceName: 'CARD_TOPUP',
    sourceRef: `ID-${getCurrentTimestamp()}`
  },
  transactionTypeCode: 'ACC2SEPA_PAY'
}

export const TRANSACTION_BODY_WITH_FEE_TRANSACTION_TYPE_ZERO = {
  details: 'Card topup',
  effectiveDate: getCurrentDateString(),
  money: {
    amount: 238,
    currencyCode: 'EUR'
  },
  fee: {
    details: "Fee",
    effectiveDate: "2020-08-03",
    money: {
      amount: 0,
      currencyCode: "EUR"
    },
    source: {
      sourceName: 'CARD_TOPUP',
      sourceRef: `ID-${getCurrentTimestamp()}`
    },
    transactionTypeCode: 0
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

export const PAYMENT_AMOUNT_NOT_SET_BODY = {
  counterparty: {
    counterpartyTypeCode: 'IBAN',
    name: 'Ben Ficher',
    value: 'EE459999000000010140'
  },
  details: 'Details',
  directionCode: 'OUT',
  effectiveDate: '2020-06-08',
  endToEndId: 'NOTPROVIDED',
  paymentTransferTypeCode: 'INSTANTREGULAR',
  paymentTypeCode: 'ACC2SEPA',
  source: {
    sourceName: 'PAYMENT',
    sourceRef: `ID-${getCurrentTimestamp()}`
  }
}

export const PAYMENT_CURRENCY_CODE_NOT_SET_BODY = {
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
    amount: 24.35
  },
  paymentTransferTypeCode: 'INSTANTREGULAR',
  paymentTypeCode: 'ACC2SEPA',
  source: {
    sourceName: 'PAYMENT',
    sourceRef: `ID-${getCurrentTimestamp()}`
  }
}

export const PAYMENT_AMOUNT_NOT_POSITIVE_BODY = {
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
    amount: -24.35,
    currencyCode: 'EUR'
  },
  paymentTransferTypeCode: 'INSTANTREGULAR',
  paymentTypeCode: 'ACC2SEPA',
  source: {
    sourceName: 'PAYMENT',
    sourceRef: `ID-${getCurrentTimestamp()}`
  }
}

export const PAYMENT_COUNTER_PARTY_IBAN_MISSING_BODY = {
  counterparty: {
    counterpartyTypeCode: 'IBAN',
    name: 'Ben Ficher'
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

export const PAYMENT_COUNTER_PARTY_NAME_MISSING_BODY = {
  counterparty: {
    counterpartyTypeCode: 'IBAN',
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

export const PAYMENT_COUNTER_PARTY_IBAN_BIC_NOT_FOUND = {
  counterparty: {
    counterpartyTypeCode: 'IBAN',
    name: 'Ben Ficher',
    value: 'EE45HBUK000000011140'
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

export const PAYMENT_WITHOUT_SOURCE_NAME_BODY = {
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
    sourceRef: `ID-${getCurrentTimestamp()}`
  }
}

export const PAYMENT_WITHOUT_SOURCE_REF_BODY = {
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
    sourceName: 'PAYMENT'
  }
}
