pipeline {
    agent any

    environment {
        WORKSPACE_DIR = "C:\\Uk\\Dev\\Faculdade\\tac\\ecommerce-devops-jenkins"
        WORKSPACE_FRONT = "${WORKSPACE_DIR}\\frontend"
        WORKSPACE_LOGIN = "${WORKSPACE_DIR}\\micro_login"
        WORKSPACE_CARDS = "${WORKSPACE_DIR}\\micro_pgt_cards"
        WORKSPACE_SEND = "${WORKSPACE_DIR}\\micro_sendproduto"
        WORKSPACE_MAIN = "${WORKSPACE_DIR}\\sistema-main"
        WORKSPACE_E2E = "${WORKSPACE_DIR}\\teste_e2e"
    }

    stages {
        stage('Checkout') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    bat """
                    echo Fazendo o checkout do código...

                    echo Configurando diretório seguro para o Git...
                    git config --global --add safe.directory ${WORKSPACE_DIR}

                    echo Limpando o diretório...
                    for /D %%i in (*) do rmdir /S /Q "%%i"
                    del /Q *.*

                    echo Clonando o repositório...
                    git clone https://github.com/Marcelo-Uk/ecommerce-devops-1.git .
                    """
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                dir("${WORKSPACE_FRONT}") {
                    bat """
                    echo Iniciando o servidor frontend...
                    start /B python -m http.server 5500
                    """
                }
            }
        }

        stage('Setup Login Microservice') {
            steps {
                dir("${WORKSPACE_LOGIN}") {
                    bat """
                    echo Configurando o microserviço de login...
                    python -m venv venv
                    call venv\\Scripts\\activate
                    pip install -r requirements.txt
                    start /B python manage.py runserver 8000
                    """
                }
            }
        }

        stage('Setup SendProduct Microservice') {
            steps {
                dir("${WORKSPACE_SEND}") {
                    bat """
                    echo Configurando o microserviço de envio de produtos...
                    python -m venv venv
                    call venv\\Scripts\\activate
                    pip install -r requirements.txt
                    start /B python manage.py runserver 8001
                    """
                }
            }
        }

        stage('Setup Main Microservice') {
            steps {
                dir("${WORKSPACE_MAIN}") {
                    bat """
                    echo Configurando o sistema de recebimento e armazenamento de produtos...
                    python -m venv venv
                    call venv\\Scripts\\activate
                    pip install -r requirements.txt
                    start /B python manage.py runserver 8002
                    """
                }
            }
        }

        stage('Setup Cards Microservice') {
            steps {
                dir("${WORKSPACE_CARDS}") {
                    bat """
                    echo Configurando o microserviço de cartões...
                    python -m venv venv
                    call venv\\Scripts\\activate
                    pip install -r requirements.txt
                    start /B python manage.py runserver 8003
                    """
                }
            }
        }

        stage('Run E2E Tests') {
            steps {
                dir("${WORKSPACE_E2E}") {
                    bat """
                    echo Executando os testes E2E...
                    call ..\\venv\\Scripts\\activate
                    pytest
                    """
                }
            }
        }
    }

    post {
        always {
            echo "Pipeline concluído."
        }
        success {
            echo "Pipeline finalizado com sucesso!"
        }
        failure {
            echo "Pipeline falhou."
        }
    }
}
