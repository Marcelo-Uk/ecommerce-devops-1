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

                    taskkill /F /IM python.exe || echo "Nenhum processo Python ativo"

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
                    start "ServidorFrontend" cmd /c "python -m http.server 5500 > frontend.log 2>&1" || exit /b 1
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
                    start "ServidorLogin" cmd /c "python manage.py runserver 8000 > login.log 2>&1" || exit /b 1
                    curl -s http://127.0.0.1:8000 || echo "Microserviço de login não está respondendo"
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
                    start "ServidorSend" cmd /c "python manage.py runserver 8001 > sendproduct.log 2>&1" || exit /b 1
                    curl -s http://127.0.0.1:8001 || echo "Microserviço de envio não está respondendo"
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
                    start "ServidorProdutos" cmd /c "python manage.py runserver 8002 > main.log 2>&1" || exit /b 1
                    curl -s http://127.0.0.1:8002 || echo "Microserviço de recebimento de produtos não está respondendo"
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
                    start "ServidorCards" cmd /c "python manage.py runserver 8003 > cards.log 2>&1" || exit /b 1
                    curl -s http://127.0.0.1:8003 || echo "Microserviço de valdação de cartões não está respondendo"
                    """
                }
            }
        }

        // Fim Carregamento dos Microserviços

        stage('Testes Unitarios Backend'){
            steps {
                dir("${WORKSPACE_LOGIN}") {
                    bat """
                    echo Iniciando os testes unitários do microserviço de login...
                    C:\\Users\\UkSam\\AppData\\Local\\Programs\\Python\\Python313\\python.exe -m venv venv
                    call venv\\Scripts\\activate
                    python manage.py test auth_service > unit_test.log 2>&1 || exit /b 1
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
                    python manage.py test cards > cards.log 2>&1 || exit /b 1
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
                    python manage.py test sendproduct > sendproduct.log 2>&1 || exit /b 1
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
                    python manage.py test produtos > produtos.log 2>&1 || exit /b 1
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
                    pytest test_integration_sendprodutos.py > integra_prods.log 2>&1 || exit /b 1
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
