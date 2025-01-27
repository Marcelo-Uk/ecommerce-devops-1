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
                    echo Limpando o diretório...

                    if exist "${WORKSPACE_DIR}" (
                        rmdir /S /Q "${WORKSPACE_DIR}"
                        echo Diretório removido. Aguardando para garantir exclusão...
                        timeout 5
                    )

                    echo Recriando o diretório...
                    mkdir "${WORKSPACE_DIR}"
                    timeout 2

                    echo Fazendo o checkout do código...
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
                    start "ServidorFrontend" cmd /c "python -m http.server 5500 > frontend.log 2>&1"
                    echo Servidor frontend iniciado.
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
                    start "ServidorLogin" cmd /c "python manage.py runserver 8000 > login.log 2>&1"
                    echo Microserviço de login iniciado.
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
                    start "ServidorSend" cmd /c "python manage.py runserver 8001 > sendproduct.log 2>&15"
                    echo Microserviço de envio de produtos iniciado.
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
                    start "ServidorProdutos" cmd /c "python manage.py runserver 8002 > main.log 2>&1"
                    echo Sistema principal iniciado.
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
                    start "ServidorCards" cmd /c "python manage.py runserver 8003 > cards.log 2>&1"
                    echo Microserviço de cartões iniciado.
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
