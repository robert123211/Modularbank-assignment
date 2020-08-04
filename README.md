# Modularbank-assignment

This repository contains the Modularbank QA Engineer test assignment.

# Detailed testing strategy of APIs

* Most important is to check if the main useflow works. This contains:
    * Creating an account
        * Validating everything is created correctly by checking response fields
    * Creating a transaction with the account
        * Validating that the response is correct
        * Checking also that the balance is changed
    * Initializing and confirming the payment
        * Validating that the response is correct
        * Checking that the balance is changed when payment is confirmed
        * Checking that the balance is not changed when payment is not confirmed or is invalid
    * Validating that payments were done correctly with correct account
* Checking APIs 400 error responses according to Swagger
* Confirming that API can be accessed by only correct headers

# Assignment
* All tests are written in Cypress framework
* Prerequisite is to have latest node downloaded
* Run command `npm install` from project directory to install dependencies
* Run command `npm run cy:chrome` to run tests in chrome, You can also use edge or firefox in the end for these browsers.

## Test results

Test results can be seen through  [Cypress Dashboard](https://dashboard.cypress.io/login)
* Login with Google account
* Username `testassignmentkrikk@gmail.com`
* Password `Modularbank`
* Latest run shows the latest findings - there are still more findings as the tests are not fully implemented yet.

## Documentation & Swagger findings
* Swagger is not up to date and contains multiple typos
    * err.technical is always thrown as a error message for 500 response, but in the Swagger it is shown as a 400 response
    * Typos like err.paymentCounterpartyIbanBicNotFounderr.paymentDetailsMissing are rather casual
* Documentation and Swagger is currently not enough to test every negative scenario, where error is given. In some cases the error response messages are intuitive and no need to explain, but not always.
    * For this reason there are some test cases which are skipped in the test suite and TODO's are added
    * For Confirming the payment, there was no documentation at all for reproducing error messages shown in Swagger

## Test findings

### Positive findings
* Endpoint authorization works correctly
    * If the authentication header is set, every endpoint works for user.
    * 401 unauthorized is given with every endpoint when user is not authorized
* Main useflow works nicely, when input data is correct

### Bugs
* Account can be created when the holder's name is invalid - For example !"#!"#€ can't be a real person name
* When inserting an unknown account ID while creating a transaction - Error "err.technical" is shown in response and not "err.accountNotFound", which would be more reasonable
* Transactions can be created when fee transaction type is invalid (In this case the type was zero, but couldn't confirm if it is a bug or mistake in Swagger)
* When inserting an invalid payment type code, the response is 500 with message "err.technical" (400 with "err.paymentTypeCodeInvalid" should be the expected response and message, when checking Swagger)
* When multiple errors come up from request body, only one error message is shown

## Integrating the test plan to CI/CD
Easiest way to integrate tests into CI would be using Jenkins. For this user has to integrate current git repository to a specific Jenkins pipeline. Tests can be run in one specific machine using the example Jenkinsfile I have created into
the repository. In the Jenkins UI, the user can set up the interval, when the tests are run.
