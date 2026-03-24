pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "yourdockerhub/my-app"
        MANIFESTS_REPO = "https://github.com/you/my-app-manifests.git"
    }

    stages {
        stage('Build & Push') {
            steps {
                script {
                    def tag = "${env.BUILD_NUMBER}"
                    withCredentials([usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        sh """
                            docker build -t ${DOCKER_IMAGE}:${tag} .
                            echo ${DOCKER_PASS} | docker login -u ${DOCKER_USER} --password-stdin
                            docker push ${DOCKER_IMAGE}:${tag}
                        """
                    }
                    env.IMAGE_TAG = tag
                }
            }
        }

        stage('Update Manifests') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'github-creds',
                    usernameVariable: 'GIT_USER',
                    passwordVariable: 'GIT_PASS'
                )]) {
                    sh """
                        git clone https://${GIT_USER}:${GIT_PASS}@github.com/you/my-app-manifests.git
                        cd my-app-manifests
                        sed -i 's|image: ${DOCKER_IMAGE}:.*|image: ${DOCKER_IMAGE}:${env.IMAGE_TAG}|' staging/deployment.yaml
                        git config user.email "jenkins@ci"
                        git config user.name "Jenkins"
                        git add staging/deployment.yaml
                        git commit -m "Update image to ${env.IMAGE_TAG}"
                        git push
                    """
                }
            }
        }
    }

    post {
        always {
            sh 'rm -rf my-app-manifests'
        }
    }
}
