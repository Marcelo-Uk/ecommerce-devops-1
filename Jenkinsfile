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

        // Inicio dos Stages

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
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
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
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
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
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
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
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    pip install -r requirements.txt
                    start "ServidorCards" cmd /c "python manage.py runserver 8003 > cards.log 2>&1"
                    echo Microserviço de cartões iniciado.
                    """
                }
            }
        }

        // Fim Carregamento dos Microserviços

        stage('Health Check') {
            steps {
                bat """
                curl -s http://localhost:5500 || echo "Frontend não está ativo"
                curl -s http://localhost:8000 || echo "Microserviço de login não está ativo"
                curl -s http://localhost:8001 || echo "Microserviço de envio de produtos não está ativo"
                curl -s http://localhost:8002 || echo "Microserviço de armazenamento de produtos não está ativo"
                curl -s http://localhost:8003 || echo "Microserviço de validação de cartões não está ativo"
                """
            }
        }

        stage('Testes Unitarios Backend'){
            steps {
                dir("${WORKSPACE_LOGIN}") {
                    bat """
                    echo Iniciando os testes unitários do microserviço de login...
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    python manage.py test auth_service > unit_test.log 2>&1
                    type unit_test.log
                    """
                }
            }
        }

        stage('Testes Unitarios Backend Cards'){
            steps {
                dir("${WORKSPACE_CARDS}") {
                    bat """
                    echo Iniciando os testes unitários do microserviço de login...
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    python manage.py test cards > cards.log 2>&1
                    type cards.log
                    """
                }
            }
        }

        stage('Testes Unitarios Backend Envia Produto'){
            steps {
                dir("${WORKSPACE_SEND}") {
                    bat """
                    echo Iniciando os testes unitários do microserviço de login...
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    python manage.py test sendproduct > sendproduct.log 2>&1
                    type sendproduct.log
                    """
                }
            }
        }

        stage('Testes Unitarios Backend Produtos'){
            steps {
                dir("${WORKSPACE_MAIN}") {
                    bat """
                    echo Iniciando os testes unitários do microserviço de login...
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    python manage.py test produtos > produtos.log 2>&1
                    type produtos.log
                    """
                }
            }
        }

        stage('Testes Unitarios Frontend') {
            steps {
                dir("${WORKSPACE_FRONT}") {
                    bat """
                    echo Instalando dependências do frontend...
                    npm install

                    echo Executando testes unitários do frontend...
                    npm test > frontend_test.log 2>&1

                    echo Exibindo o resultado dos testes...
                    type frontend_test.log
                    """
                }
            }
        }

        stage('Testes Integração Backend Produtos => Envia | Recebe | Armazena'){
            steps {
                dir("${WORKSPACE_MAIN}") {
                    bat """
                    echo Iniciando os testes de integração dos produtos...
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    pytest test_integration_sendprodutos.py > integra_prods.log 2>&1
                    type integra_prods.log
                    """
                }
            }
        }

    }

    // Fim dos Stages

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
