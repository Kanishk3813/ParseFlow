pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                git credentialsId: 'github-credentials', url: 'https://github.com/Kanishk3813/ParseFlow'
            }
        }

        stage('Build') {
            steps {
                echo 'Building the application...'
                // Add your build commands here, e.g.:
                // sh 'npm install' for Node.js
                // sh './gradlew build' for Java
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add your test commands, e.g.:
                // sh 'npm test'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                // Add your deploy steps
            }
        }
    }
}
