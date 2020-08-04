pipeline {
    options {
        buildDiscarder(logRotator(artifactNumToKeepStr: '5', daysToKeepStr: '15', numToKeepStr: '50'))
    }
    agent{
        label '{{machine-name-in-Jenkins-where-the-tests-are-run-from}}'
    }
    stages {
        stage('Clone tests repo') {
                git branch: 'master', url: 'git@github.com:robert123211/Modularbank-assignment.git'
            }

        stage('Install all dependencies') {
            sh 'npm install'
        }

        stage('Run api tests in Chrome') {
            sh 'npm run cy:chrome'
        }
    }
}
