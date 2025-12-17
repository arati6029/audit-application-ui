pipeline {
    agent any

    environment {
        REGISTRY = "docker.io"
        DOCKER_USER = "arati6029"
        IMAGE_NAME = "audit-portal-ui"
        CONTAINER_NAME = "audit-portal-ui"
        // Add Node.js and Angular CLI to PATH
        PATH = "${env.PATH}:/var/jenkins_home/.nvm/versions/node/v18.20.2/bin"
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    // 1. Install Node.js via nvm
                    sh '''
                        # Install nvm if not exists
                        if [ ! -d "$HOME/.nvm" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                        else
                            export NVM_DIR="$HOME/.nvm"
                            [ -s "$NVM_DIR/nvm.sh" ] && \\. "$NVM_DIR/nvm.sh"
                        fi
                        
                        # Install and use Node.js 18 (LTS)
                        nvm install 18
                        nvm use 18
                        
                        # Install Angular CLI globally
                        npm install -g @angular/cli
                        
                        # Install project dependencies
                        npm ci
                    '''
                    
                    // 2. Verify installations
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'ng version'
                }
            }
        }

        stage('Lint') {
            steps {
                script {
                    sh 'ng lint'
                }
            }
        }

        stage('Test') {
            steps {
                script {
                    // Install ChromeHeadless dependencies first
                    sh '''
                        apt-get update || true
                        apt-get install -y wget gnupg || true
                        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
                        echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
                        apt-get update || true
                        apt-get install -y google-chrome-stable || true
                    '''
                    
                    // Run tests
                    sh 'ng test --watch=false --browsers=ChromeHeadless --no-progress'
                }
            }
        }

        stage('Build') {
            steps {
                script {
                    // Clean previous build
                    sh 'rm -rf dist/* || true'
                    
                    # Build Angular app
                    sh 'ng build --configuration=production'
                    
                    # Verify build output
                    sh 'ls -la dist/'
                }
            }
        }

        stage('Docker Build') {
            when {
                branch 'master'
            }
            steps {
                script {
                    // Build Docker image
                    sh '''
                        docker build -t ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER} .
                        docker build -t ${DOCKER_USER}/${IMAGE_NAME}:latest .
                    '''
                    
                    // Optionally push to registry
                    // withCredentials([usernamePassword(credentialsId: 'docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    //     sh '''
                    //         docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}
                    //         docker push ${DOCKER_USER}/${IMAGE_NAME}:${BUILD_NUMBER}
                    //         docker push ${DOCKER_USER}/${IMAGE_NAME}:latest
                    //     '''
                    // }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'master'
            }
            steps {
                script {
                    // Stop and remove old container
                    sh '''
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                    '''
                    
                    // Run new container
                    sh '''
                        docker run -d \
                          --name ${CONTAINER_NAME} \
                          -p 80:80 \
                          --restart unless-stopped \
                          ${DOCKER_USER}/${IMAGE_NAME}:latest
                    '''
                }
            }
        }
    }

    post {
        always {
            // Clean workspace but preserve useful logs
            archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
            junit '**/test-results.xml'  // If Karma generates JUnit reports
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
            // Optional: Send notification
            // emailext body: 'Build succeeded!', subject: 'Pipeline Success', to: 'team@example.com'
        }
        failure {
            echo 'Pipeline failed!'
            // Optional: Send failure notification
            // emailext body: 'Build failed. Check Jenkins logs.', subject: 'Pipeline Failed', to: 'team@example.com'
        }
    }
}