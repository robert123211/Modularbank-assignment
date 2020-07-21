import { getCurrentTimestamp } from '../utils'

export const TRANSACTION_POST_URL = (accountId) => `https://account-api.sandbox.modularbank.xyz/api/v1/accounts/${accountId}/transactions`

export const CORRECT_TRANSACTION_BODY = {
  details: 'Card topup',
  effectiveDate: '2020-06-08',
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
