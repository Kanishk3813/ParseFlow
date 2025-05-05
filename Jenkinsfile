pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'kanishk3813/parseflow-app' 
    }

    stages {
        stage('Clone Repo') {
            steps {
                git credentialsId: 'github-credentials', url: 'https://github.com/Kanishk3813/ParseFlow'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE .'
                }
            }
        }

        stage('Docker Login') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        echo 'Logged into DockerHub'
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        sh "docker push $DOCKER_IMAGE"
                    }
                }
            }
        }
    }
}
