pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Instalar dependencias') {
            steps {
                bat 'npm install'
            }
        }

        stage('Pruebas unitarias') {
            steps {
                bat 'npm test -- --watchAll=false --ci'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'junit-results.xml'
                }
            }
        }

        stage('Reporte de cobertura') {
            steps {
                bat 'npm test -- --watchAll=false --ci --coverage --coverageReporters=text --coverageReporters=lcov'
            }
            post {
                always {
                    publishHTML(target: [
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'coverage/lcov-report',
                        reportFiles: 'index.html',
                        reportName: 'Cobertura de Código'
                    ])
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completada - todos los tests pasaron'
        }
        failure {
            echo 'Pipeline fallida - revisar resultados en Jenkins'
        }
    }
}
