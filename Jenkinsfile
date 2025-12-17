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
                    // Install required Node.js version using nvm
                    if (isUnix()) {
                        sh 'curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash'
                        sh 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm install $NODE_VERSION'
                        sh 'export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh" && nvm use $NODE_VERSION'
                    } else {
                        // For Windows
                        bat 'nvm install %NODE_VERSION%'
                        bat 'nvm use %NODE_VERSION%'
                    }
                    
                    // Install Angular CLI globally
                    if (isUnix()) {
                        sh 'npm install -g @angular/cli@$NG_CLI_VERSION'
                    } else {
                        bat 'npm install -g @angular/cli@%NG_CLI_VERSION%'
                    }
                    
                    // Install project dependencies
                    if (isUnix()) {
                        sh 'npm ci'
                    } else {
                        bat 'npm ci'
                    }
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