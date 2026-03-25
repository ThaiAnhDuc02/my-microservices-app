pipeline {
    agent any
    
    environment {
        IMAGE = "anhduc8702/my-microservices-app"
        MANIFEST_REPO = "github.com/ThaiAnhDuc02/my-microservices-app-manifest.git"
    }
    
    stages {
        stage('Build & Test') {
            steps {
                sh 'docker build -t $IMAGE:$BUILD_NUMBER .'
                // Skip test for now - add back when tests are ready
                // sh 'docker run --rm $IMAGE:$BUILD_NUMBER npm test'
            }
        }
        
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                usernameVariable: 'DOCKER_USER',
                                                passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push $IMAGE:$BUILD_NUMBER
                        docker tag  $IMAGE:$BUILD_NUMBER $IMAGE:latest
                        docker push $IMAGE:latest
                    '''
                }
            }
        }
        
        stage('Update Manifest Repo') {
            steps {
                withCredentials([string(credentialsId: 'github-manifest-token',
                               variable: 'GH_TOKEN')]) {
                    sh '''
                        git clone https://$GH_TOKEN@$MANIFEST_REPO manifests
                        cd manifests
                        sed -i "s|$IMAGE:.*|$IMAGE:$BUILD_NUMBER|g" staging/deployment.yaml
                        git config user.email "jenkins@ci.local"
                        git config user.name  "Jenkins"
                        git add staging/deployment.yaml
                        git commit -m "ci: update image to $BUILD_NUMBER"
                        git push
                    '''
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            cleanWs()
        }
    }
}
