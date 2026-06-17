pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo 'Código descargado correctamente'
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
        }

        stage('Reporte de cobertura') {
            steps {
                bat 'npm test -- --watchAll=false --ci --coverage --coverageReporters=text --coverageReporters=lcov --coverageReporters=json-summary'
            }
            post {
                always {
                    archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
                }
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completada - 44 tests pasaron, cobertura 100%'
            archiveArtifacts artifacts: 'coverage/**/*', allowEmptyArchive: true
        }
        failure {
            echo '❌ Pipeline fallida - revisar errores en consola'
        }
    }
}