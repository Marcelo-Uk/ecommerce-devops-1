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
                    bat '''
                    for /F "tokens=*" %%i in ('docker ps -aq') do (docker rm -f %%i || echo "Falha ao remover container %%i")
                    for /F "tokens=*" %%i in ('docker images -aq') do (docker rmi -f %%i || echo "Falha ao remover imagem %%i")
                    docker network prune -f || echo "Nenhuma rede para remover"
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    bat 'docker build -t frontend_image .'
                }
            }
        }

        // ... Outras etapas de build (Micro Login, Send Produto, etc.)

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
                        logs += bat(script: 'docker exec micro_login_container python manage.py test', returnStdout: true)
                        logs += bat(script: 'docker exec micro_pgt_cards_container python manage.py test', returnStdout: true)
                        logs += bat(script: 'docker exec sistema_main_container python manage.py test', returnStdout: true)
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
                        if exist devops-prod (rmdir /s /q devops-prod)
                        git clone https://${GIT_USER}:${GIT_PASS}@github.com/Marcelo-Uk/devops-prod.git devops-prod
                        echo devops-prod\\ > exclude.txt
                        xcopy /E /Y /I . devops-prod\\ /EXCLUDE:exclude.txt
                        cd devops-prod
                        git add .
                        git commit -m "Atualizando produção via pipeline Jenkins"
                        git push
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            emailext(
                subject: "Pipeline Sucesso: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Pipeline finalizado com sucesso!\nVeja os detalhes: ${env.BUILD_URL}",
                to: 'mribeirocorp@gmail.com'
            )
        }
        failure {
            emailext(
                subject: "Pipeline Falhou: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "Pipeline falhou. Verifique os detalhes no Jenkins.\nLogs:\n${logs}\nURL: ${env.BUILD_URL}",
                to: 'mribeirocorp@gmail.com'
            )
        }
    }
}



//githubToken