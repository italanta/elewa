pipeline {
    agent any
    tools {
        nodejs "node16"
    }

    environment {
        FIREBASE_TOKEN = credentials('ENABEL_FIREBASE_TOKEN')
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

        stage('Deploy to Enabel firebase hosting') { 
            steps {
                withCredentials([file(credentialsId: 'enabel-prod-environment-file', variable: 'ENV_FILE')]) {
                // some block
                sh 'mkdir -p apps/conv-learning-manager/src/environments && sudo cat ${ENV_FILE} > apps/conv-learning-manager/src/environments/environment.ts'
                sh 'echo $FIREBASE_TOKEN'
                sh 'firebase use enabel-elearning'
                sh 'firebase deploy --token ${FIREBASE_TOKEN} --only hosting' 
}
            }
        }
    }
}