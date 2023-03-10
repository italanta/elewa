pipeline {
    agent any
    tools {
        nodejs "node16"
    }

    environment {
        FIREBASE_TOKEN = credentials('ENABEL_FIREBASE_TOKEN');
        ENV_FILE_DEST = 'apps/conv-learning-manager/src/environments/environment.ts'
        ENV_FILE_DEST_PROD = 'apps/conv-learning-manager/src/environments/environment.prod.ts'
        }
    stages {
        stage ('Install firebase-tools'){
            steps {
               sh "npm install -g firebase-tools"
            }
        }

        stage('Build the project') { 
            steps {
                sh 'npm install --legacy-peer-deps' 
            }
        }

        stage('Deploy to Enabel') { 
            steps {
                withCredentials([file(credentialsId: 'enabel-prod-environment-file', variable: 'ENV_FILE')]) {
                // some block
                sh 'mkdir -p apps/conv-learning-manager/src/environments'
                sh 'cat ${ENV_FILE} > ${ENV_FILE_DEST}'
                sh 'cat ${ENV_FILE} > ${ENV_FILE_DEST_PROD}'
                sh 'firebase use enabel-elearning'
                sh 'firebase deploy --token ${FIREBASE_TOKEN} --only hosting' 
}
            }
        }

        stage('Deploy to Farmbetter') { 
            steps {

                sshagent(['github_jenkins_ssh']) {
                    sh 'git checkout farmbetter-private-dev'
                    sh 'git pull origin farmbetter-private-dev'
                    sh 'git merge origin/private-prod'
                    sh 'git push origin farmbetter-private-dev'
                }

                withCredentials([file(credentialsId: 'farmbetter-prod-environment-file', variable: 'ENV_FILE')]) {
                // some block
                
                sh 'mkdir -p apps/conv-learning-manager/src/environments'
                sh 'sudo cat ${ENV_FILE} > ${ENV_FILE_DEST}'
                sh 'sudo cat ${ENV_FILE} > ${ENV_FILE_DEST_PROD}'
                sh 'firebase use farmbetter-prod'
                sh 'firebase deploy --token ${FIREBASE_TOKEN} --only hosting' 
}
            }
        }
    }
}