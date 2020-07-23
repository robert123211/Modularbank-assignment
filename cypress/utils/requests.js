export const createRequestWithBody = (method, url, headers, body) => {
  return cy.request({
    method: method,
    url: url,
    headers: headers,
    body: body,
    failOnStatusCode: false
  })
}

export const createRequestWithoutBody = (method, url, headers) => {
  return cy.request({
    method: method,
    url: url,
    headers: headers,
    failOnStatusCode: false
  })
}
