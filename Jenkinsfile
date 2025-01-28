pipeline {
    agent any

    environment {
        logs = '' // Variável global para logs
        GITHUB_REPO_URL = 'https://github.com/Marcelo-Uk/devops-prod.git' // Repositório de produção
        GITHUB_CREDENTIALS_ID = 'githubToken' // Substitua pelo ID da credencial no Jenkins
    }

    stages {
        stage('Inicializar Variáveis') {
            steps {
                script {
                    logs = '' // Inicializando variável de logs
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
                    bat '''
                    for /F "tokens=*" %%i in ('docker ps -aq') do (docker rm -f %%i || echo "Falha ao remover container %%i")
                    '''
                    bat '''
                    for /F "tokens=*" %%i in ('docker images -aq') do (docker rmi -f %%i || echo "Falha ao remover imagem %%i")
                    '''
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
                        echo "=== Rodando testes para micro_login_container ==="
                        logs += bat(script: 'docker exec micro_login_container python manage.py test', returnStdout: true)
                        echo "=== Rodando testes para micro_pgt_cards_container ==="
                        logs += bat(script: 'docker exec micro_pgt_cards_container python manage.py test', returnStdout: true)
                        echo "=== Rodando testes para sistema_main_container ==="
                        logs += bat(script: 'docker exec sistema_main_container python manage.py test', returnStdout: true)
                        echo "=== Rodando testes para sendproduto_container ==="
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

                    // Bloco seguro para autenticação
                    withCredentials([usernamePassword(credentialsId: "${GITHUB_CREDENTIALS_ID}", usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        // Formatar username para evitar problemas com caracteres especiais
                        def escapedUser = URLEncoder.encode(GIT_USER, "UTF-8")

                        // Clonar o repositório
                        bat """
                        if exist devops-prod (rmdir /s /q devops-prod)
                        git clone https://${escapedUser}:${GIT_PASS}@github.com/Marcelo-Uk/devops-prod.git devops-prod
                        """

                        // Copiar arquivos para o repositório
                        bat 'xcopy /E /Y /I * devops-prod\\'

                        dir('devops-prod') {
                            // Adicionar e enviar os arquivos
                            bat '''
                            git add .
                            git commit -m "Deploy automático via Jenkins: ${env.BUILD_NUMBER}"
                            git push https://${escapedUser}:${GIT_PASS}@github.com/Marcelo-Uk/devops-prod.git
                            '''
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
