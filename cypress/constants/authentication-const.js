export const AUTH_BASE_URL = 'https://auth-api.sandbox.modularbank.xyz/api/v1/employees/authorise'
export const X_TENANT_CODE = 'SANDBOX'
export const X_CHANNEL_CODE = 'SYSTEM'
export const USERNAME = 'modular.system'
export const PASSWORD = 'pass'

export const AUTH_HEADERS = {
  'x-tenant-code': X_TENANT_CODE,
  'x-channel-code': X_CHANNEL_CODE
}

export const AUTH_PAYLOAD = {
  username: USERNAME,
  password: PASSWORD
}

export const POST_HEADERS = {
  'x-tenant-code': X_TENANT_CODE,
  'x-channel-code': X_CHANNEL_CODE,
  'Content-Type': 'application/json',
  'x-auth-token': ''
}
export const GET_HEADERS = {
  'x-tenant-code': X_TENANT_CODE,
  'x-channel-code': X_CHANNEL_CODE,
  'x-auth-token': ''
}
