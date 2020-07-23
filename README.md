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

## Test results

Test results can be seen through  [Cypress Dashboard](https://dashboard.cypress.io/login)
* Login with Google account
* Username `testassignmentkrikk@gmail.com`
* Password `Modularbank`
* Latest run shows the latest findings - there are still more findings as the tests are not fully implemented yet.
Currently it seems that Swagger doesn't have up to date information or is buggy - 400 errors are all not reproducable and include also 500 errors 
## Integrating the test plan to CI/CD
Easiest way to integrate tests into CI would be using Jenkins. For this user has to integrate current git repository to a specific Jenkins pipeline. Tests can be run in one specific machine using the example Jenkinsfile I have created into
the repository. In the Jenkins UI, the user can set up the interval, when the tests are run.
