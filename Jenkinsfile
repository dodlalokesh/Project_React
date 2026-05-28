pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yourdockerhubusername/react-vite-app"
        DOCKER_TAG = "latest"
    }

    stages {

        stage('Git Checkout') {
            steps {
                git branch: 'main',
                credentialsId: 'githubtoken',
                url: 'https://github.com/dodlalokesh/Project_React.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh '''
                rm -rf node_modules package-lock.json
                npm cache clean --force
                npm install
                '''
            }
        }

        stage('Build React App') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE:$DOCKER_TAG .'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Docker Push') {
            steps {
                sh 'docker push $DOCKER_IMAGE:$DOCKER_TAG'
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline executed successfully!'
        }

        failure {
            echo '❌ Pipeline failed!'
        }
    }
}