// ===========================================================
// Jenkinsfile · Pipeline CI/CD de Jaslaw
// Equivalente funcional al workflow de GitHub Actions.
// ===========================================================
pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        IMAGE      = "jaslaw"
        REGISTRY   = "registry.local:5000"
        SONAR_HOST = "http://sonarqube:9000"
    }

    options {
        timestamps()
        timeout(time: 25, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }

    stages {
        stage('1 · Checkout') {
            steps {
                checkout scm
                sh 'git rev-parse --short HEAD'
            }
        }

        stage('2 · Dependencias') {
            steps {
                sh 'npm ci'
            }
        }

        stage('3 · Análisis estático') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('4 · Pruebas unitarias') {
            steps {
                sh 'npm run test:coverage'
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'reports/junit.xml'
                    publishHTML(target: [
                        allowMissing        : true,
                        alwaysLinkToLastBuild: true,
                        keepAll             : true,
                        reportDir           : 'coverage/lcov-report',
                        reportFiles         : 'index.html',
                        reportName          : 'Cobertura de pruebas'
                    ])
                }
            }
        }

        stage('5 · Calidad (SonarQube)') {
            steps {
                sh 'npx sonar-scanner -Dproject.settings=code-quality/sonar-project.properties'
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('6 · Seguridad') {
            steps {
                sh 'npm run audit:ci'
                sh 'trivy fs --severity CRITICAL,HIGH --exit-code 1 --ignore-unfixed .'
            }
        }

        stage('7 · Build') {
            steps {
                sh 'npm run build'
                sh 'npm run check:bundle'
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }

        stage('8 · Imagen Docker') {
            steps {
                sh "docker build -t $REGISTRY/$IMAGE:$BUILD_NUMBER -t $REGISTRY/$IMAGE:latest ."
                sh "trivy image --severity CRITICAL,HIGH --exit-code 1 $REGISTRY/$IMAGE:$BUILD_NUMBER"
                sh "docker push $REGISTRY/$IMAGE:$BUILD_NUMBER"
            }
        }

        stage('9 · Despliegue a staging') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'staging-ssh', keyFileVariable: 'KEY')]) {
                    sh '''
                      ssh -i "$KEY" -o StrictHostKeyChecking=no deploy@staging.jaslaw.local \
                        "docker pull $REGISTRY/$IMAGE:$BUILD_NUMBER && \
                         docker run -d --name jaslaw --restart unless-stopped -p 8080:8080 $REGISTRY/$IMAGE:$BUILD_NUMBER"
                    '''
                }
                sh 'curl -sSf http://staging.jaslaw.local:8080/healthz | grep -q ok'
            }
        }

        stage('10 · Aprobación a producción') {
            when {
                branch 'main'
            }
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    input message: '¿Desplegar en producción?', ok: 'Desplegar'
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completado correctamente.'
        }
        failure {
            echo 'Pipeline falló: se notifica al equipo y se bloquea la entrega.'
        }
        always {
            cleanWs()
        }
    }
}
