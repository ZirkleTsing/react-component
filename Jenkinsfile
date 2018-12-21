def username = '小刘鸭的持续集成1.0'
pipeline {
    agent any
    environment {
        // Using returnStdout
        CC = """${sh(
                returnStdout: true,
                script: 'echo "小刘鸭小刘鸭clang"'
            )}"""
        // Using returnStatus
        EXIT_STATUS = """${sh(
                returnStatus: true,
                script: 'exit 17'
            )}"""
    }
    stages {
        stage('Example') {
           environment {
                DEBUG_FLAGS = '-g'
            }
            steps {
                sh "echo '用户 ${username} 开始构建系统...'"
                checkout scm
                sh 'printenv'
            }
        }
        stage('Build') {
            steps {

                echo "I said, Hello Mr. ${username}"
                echo 'Building..'
            }
        }
        stage('Test') {
            steps {
                echo 'Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
