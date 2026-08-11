pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 45, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15'))
    }

    environment {
        COMPOSE_PROJECT_NAME = 'gateflow-ci'
        BACKEND_IMAGE = 'gateflow-backend'
        FRONTEND_IMAGE = 'gateflow-frontend'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        POSTGRES_DB = 'gateflow'
        POSTGRES_USER = 'gateflow'
        POSTGRES_PASSWORD = 'gateflow'
        JWT_SECRET = 'ci-jwt-secret-minimum-256-bits-long-for-testing'
        STRIPE_API_KEY = 'sk_test_placeholder'
        STRIPE_WEBHOOK_SECRET = 'whsec_placeholder'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Backend Tests') {
            steps {
                dir('Backend') {
                    sh './mvnw clean test -B'
                }
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'Backend/target/surefire-reports/*.xml'
                }
            }
        }

        stage('Frontend Quality') {
            steps {
                dir('Frontend') {
                    sh 'npm install'
                    sh 'npm run lint'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            parallel {
                stage('Backend Image') {
                    steps {
                        dir('Backend') {
                            sh """
                                docker build \
                                  -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                  -t ${BACKEND_IMAGE}:latest \
                                  .
                            """
                        }
                    }
                }

                stage('Frontend Image') {
                    steps {
                        dir('Frontend') {
                            sh """
                                docker build \
                                  --build-arg VITE_API_BASE_URL=/api/v1 \
                                  --build-arg VITE_PLANS_URL=/plans \
                                  -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                  -t ${FRONTEND_IMAGE}:latest \
                                  .
                            """
                        }
                    }
                }
            }
        }

        stage('Integration Smoke Test') {
            steps {
                sh '''
                    docker compose down -v --remove-orphans || true
                    docker compose up -d postgres kafka
                '''

                sh '''
                    for i in $(seq 1 30); do
                        if docker compose exec -T postgres pg_isready -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" >/dev/null 2>&1; then
                            echo "PostgreSQL is ready"
                            exit 0
                        fi
                        sleep 2
                    done
                    echo "PostgreSQL did not become ready in time"
                    exit 1
                '''

                sh '''
                    docker compose up -d --no-build backend frontend
                '''

                sh '''
                    for i in $(seq 1 60); do
                        if docker run --rm --network ${COMPOSE_PROJECT_NAME}_gateflow-net curlimages/curl:8.5.0 \
                            -sf http://backend:8081/actuator/health >/dev/null; then
                            echo "Backend is healthy"
                            break
                        fi
                        if [ "$i" -eq 60 ]; then
                            echo "Backend health check failed"
                            docker compose logs backend
                            exit 1
                        fi
                        sleep 3
                    done

                    docker run --rm --network ${COMPOSE_PROJECT_NAME}_gateflow-net curlimages/curl:8.5.0 \
                        -sf http://frontend:80/ >/dev/null
                    docker run --rm --network ${COMPOSE_PROJECT_NAME}_gateflow-net curlimages/curl:8.5.0 \
                        -sf http://frontend:80/plans >/dev/null
                '''
            }
        }
    }

    post {
        always {
            sh 'docker compose down -v --remove-orphans || true'
        }
        success {
            echo "Pipeline succeeded. Images: ${BACKEND_IMAGE}:${IMAGE_TAG}, ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }
        failure {
            echo 'Pipeline failed. Review stage logs and archived test reports.'
        }
    }
}
