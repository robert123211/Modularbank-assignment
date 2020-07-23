/**
 * Create request, which has body sent with it also
 * @param method - GET or POST request method
 * @param url - Endpoint, where the request is sent
 * @param headers - Headers, which are sent with the request
 * @param body - Request body
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const createRequestWithBody = (method, url, headers, body) => {
  return cy.request({
    method: method,
    url: url,
    headers: headers,
    body: body,
    failOnStatusCode: false
  })
}

/**
 * Create request, which has body sent with it also
 * @param method - GET or POST request method
 * @param url - Endpoint, where the request is sent
 * @param headers - Headers, which are sent with the request
 * @returns {Cypress.Chainable<Cypress.Response>}
 */
export const createRequestWithoutBody = (method, url, headers) => {
  return cy.request({
    method: method,
    url: url,
    headers: headers,
    failOnStatusCode: false
  })
}
