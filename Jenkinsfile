pipeline {
    agent any

    // Variável "logs" definida no environment para ser acessível globalmente
    environment {
        logs = '' // Variável global para armazenar logs
        GITHUB_REPO_URL = 'https://github.com/Marcelo-Uk/devops-prod.git' // Repositório de destino
        GITHUB_CREDENTIALS_ID = 'githubToken' // Substitua pelo ID da credencial que você configurou no Jenkins
    }

    stages {
        stage('Inicializar Variáveis') {
            steps {
                script {
                    // Inicialize a variável logs como string vazia para evitar erros
                    logs = ''
                }
            }
        }

        stage('Checkout') {
            steps {
                echo "Clonando o repositório do GitHub..."
                checkout scm
            }
        }

        stage('Limpar Ambiente') {
            steps {
                echo "Limpando o ambiente: containers, imagens e redes antigas..."
                script {
                    // Remove todos os containers
                    bat '''
                    for /F "tokens=*" %%i in ('docker ps -aq') do (docker rm -f %%i || echo "Falha ao remover container %%i")
                    '''

                    // Remove todas as imagens
                    bat '''
                    for /F "tokens=*" %%i in ('docker images -aq') do (docker rmi -f %%i || echo "Falha ao remover imagem %%i")
                    '''

                    // Remove todas as redes customizadas
                    bat 'docker network prune -f || echo "Nenhuma rede para remover"'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo "Construindo imagem do frontend..."
                    bat 'docker build -t frontend_image .'
                }
            }
        }

        stage('Build Micro Login') {
            steps {
                dir('micro_login') {
                    echo "Construindo imagem do micro_login..."
                    bat 'docker build -t micro_login_image .'
                }
            }
        }

        stage('Build Send Produto') {
            steps {
                dir('micro_sendproduto') {
                    echo "Construindo imagem do sendproduto..."
                    bat 'docker build -t sendproduto_image .'
                }
            }
        }

        stage('Build Sistema Main') {
            steps {
                dir('sistema-main') {
                    echo "Construindo imagem do sistema_main..."
                    bat 'docker build -t sistema_main_image .'
                }
            }
        }

        stage('Build Micro PGT Cards') {
            steps {
                dir('micro_pgt_cards') {
                    echo "Construindo imagem do micro_pgt_cards..."
                    bat 'docker build -t micro_pgt_cards_image .'
                }
            }
        }

        stage('Subir Containers') {
            steps {
                echo "Subindo os containers com docker-compose..."
                bat 'docker-compose up -d'
            }
        }

        stage('Verificar Containers') {
            steps {
                echo "Verificando os containers que estão rodando..."
                bat 'docker ps -a'
            }
        }

        stage('Testes Unitários') {
            steps {
                script {
                    try {
                        echo "=== Rodando testes para micro_login_container (auth_service) ==="
                        logs += "=== Rodando testes para micro_login_container (auth_service) ===\n"
                        logs += bat(script: 'docker exec micro_login_container python manage.py test', returnStdout: true)

                        echo "=== Rodando testes para micro_pgt_cards_container (cards) ==="
                        logs += "=== Rodando testes para micro_pgt_cards_container (cards) ===\n"
                        logs += bat(script: 'docker exec micro_pgt_cards_container python manage.py test', returnStdout: true)

                        echo "=== Rodando testes para sistema_main_container (produtos) ==="
                        logs += "=== Rodando testes para sistema_main_container (produtos) ===\n"
                        logs += bat(script: 'docker exec sistema_main_container python manage.py test', returnStdout: true)

                        echo "=== Rodando testes para sendproduto_container (sendproduct) ==="
                        logs += "=== Rodando testes para sendproduto_container (sendproduct) ===\n"
                        logs += bat(script: 'docker exec sendproduto_container python manage.py test', returnStdout: true)
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Erro nos testes unitários:\n${logs}"
                    }
                }
            }
        }

        stage('Enviar para Produção') {
            steps {
                script {
                    echo "Enviando os arquivos para o repositório de produção..."

                    // Clona o repositório de produção usando as credenciais configuradas
                    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        bat """
                        if exist devops-prod (rmdir /s /q devops-prod)
                        git clone https://${GIT_USER}:${GIT_PASS}@github.com/Marcelo-Uk/devops-prod.git devops-prod
                        """

                        // Copia os arquivos do workspace para o repositório clonado
                        bat 'xcopy /E /Y /I * devops-prod\\'

                        dir('devops-prod') {
                            // Adiciona, faz commit e push dos arquivos
                            bat """
                            git add .
                            git commit -m "Deploy automático via Jenkins: ${env.BUILD_NUMBER}"
                            git push https://${GIT_USER}:${GIT_PASS}@github.com/Marcelo-Uk/devops-prod.git
                            """
                        }
                    }
                }
            }
        }


    }

    post {
        success {
            echo "Pipeline finalizado com sucesso!"
            emailext (
                subject: "Pipeline Sucesso: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    O pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} foi finalizado com sucesso.
                    Veja os detalhes: ${env.BUILD_URL}
                """,
                to: 'mribeirocorp@gmail.com'
            )
        }
        failure {
            echo "Pipeline falhou!"
            script {
                emailext (
                    subject: "Pipeline Falhou: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                    body: """
                        O pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} falhou.
                        Logs dos testes:
                        ${logs}
                        Veja os detalhes no Jenkins: ${env.BUILD_URL}
                    """,
                    to: 'mribeirocorp@gmail.com'
                )
            }
        }
    }
}
