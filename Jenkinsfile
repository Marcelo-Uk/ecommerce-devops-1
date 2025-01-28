pipeline {
    agent any

    environment {
        logs = ''
        GITHUB_CREDENTIALS_ID = 'githubToken'
    }

    stages {
        stage('Inicializar Variáveis') {
            steps {
                script {
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
                script {
                    catchError(buildResult: 'UNSTABLE', stageResult: 'UNSTABLE') {
                        echo "Limpando o ambiente: containers, imagens e redes antigas..."
                        bat '''
                        set CONTAINERS=$(docker ps -aq)
                        if not "%CONTAINERS%"=="" (
                            for /F "tokens=*" %%i in ('docker ps -aq') do (docker rm -f %%i || echo "Falha ao remover container %%i")
                        ) else (
                            echo "Nenhum container para remover"
                        )
                        '''
                        bat '''
                        set IMAGES=$(docker images -aq)
                        if not "%IMAGES%"=="" (
                            for /F "tokens=*" %%i in ('docker images -aq') do (docker rmi -f %%i || echo "Falha ao remover imagem %%i")
                        ) else (
                            echo "Nenhuma imagem para remover"
                        )
                        '''
                        bat 'docker network prune -f || echo "Nenhuma rede para remover"'
                    }
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
                bat 'docker-compose up -d'
            }
        }

        stage('Verificar Containers') {
            steps {
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
                    withCredentials([usernamePassword(credentialsId: GITHUB_CREDENTIALS_ID, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                        echo 'Enviando os arquivos para o repositório de produção...'

                        bat '''
                        REM Configurar nome e email do autor para o commit
                        git config user.email "mribeirocorp@gmail.com"
                        git config user.name "Marcelo-Uk"

                        REM Verificar e criar o branch main, se necessário
                        git checkout -b main || git checkout main

                        REM Adicionar arquivos e fazer commit
                        git add .
                        git commit -m "Atualizando produção via pipeline Jenkins" || echo "Nada para commitar, talvez sem alterações"

                        REM Fazer o push para o repositório remoto
                        git push https://${GIT_USER}:${GIT_PASS}@github.com/Marcelo-Uk/devops-prod.git main || echo "Erro no push. Confirme se o branch main existe no repositório remoto."
                        '''
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



//Marco Zero + Envio Prod - Teste 5
//githubToken