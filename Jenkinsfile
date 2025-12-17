pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"
        DOCKER_USER = "arati6029"
        IMAGE_NAME = "audit-portal-ui"
        CONTAINER_NAME = "audit-portal-ui"
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // Jenkins will automatically set up Node.js
                     sh 'node --version'
                     sh 'npm --version'
        }
    }
}
        stage('Lint') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'ng lint'
                    } else {
                        bat 'ng lint'
                    }
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'ng test --watch=false --browsers=ChromeHeadless'
                    } else {
                        bat 'ng test --watch=false --browsers=ChromeHeadless'
                    }
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    if (isUnix()) {
                        sh 'ng build --configuration=production'
                    } else {
                        bat 'ng build --configuration=production'
                    }
                }
            }
        }

        stage('Docker Build') {
            when {
                branch 'master'  // Only build Docker image on main branch
            }
            steps {
                script {
                    def dockerImage = docker.build("audit-portal-ui:${env.BUILD_NUMBER}")
                    // You can add steps to push to a container registry here
                    // docker.withRegistry('https://your-registry', 'credentials-id') {
                    //     dockerImage.push()
                    // }
                }
            }
        }
    }

    post {
        always {
            // Clean up workspace
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}