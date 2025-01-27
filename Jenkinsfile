pipeline {
    agent any

    environment {
        WORKSPACE_DIR = "/c/Uk/Dev/Faculdade/tac/ecommerce-devops-jenkins"
        WORKSPACE_FRONT = "${WORKSPACE_DIR}/frontend"
        WORKSPACE_LOGIN = "${WORKSPACE_DIR}/micro_login"
        WORKSPACE_CARDS = "${WORKSPACE_DIR}/micro_pgt_cards"
        WORKSPACE_SEND = "${WORKSPACE_DIR}/micro_sendproduto"
        WORKSPACE_MAIN = "${WORKSPACE_DIR}/sistema-main"
        WORKSPACE_E2E = "${WORKSPACE_DIR}/teste_e2e"
    }

    stages {
        stage('Checkout') {
            steps {
                dir("${WORKSPACE_DIR}") {
                    sh """
                    echo Fazendo o checkout do código...
                    if [ -d .git ]; then
                        echo "Removendo arquivos antigos..."
                        git reset --hard
                        git clean -fdx  # Remove arquivos não rastreados e diretórios extras
                    else
                        rm -rf ./* ./.git
                    fi
                    git clone https://github.com/Marcelo-Uk/ecommerce-devops-1.git .
                    """
                }
            }
        }

        stage('Setup Frontend') {
            steps {
                dir("${WORKSPACE_FRONT}") {
                    sh """
                    echo Iniciando o servidor frontend...
                    nohup python -m http.server 5500 &
                    """
                }
            }
        }

        stage('Setup Login Microservice') {
            steps {
                dir("${WORKSPACE_LOGIN}") {
                    sh """
                    echo Configurando o microserviço de login...
                    python -m venv venv
                    source venv/bin/activate
                    pip install -r requirements.txt
                    nohup python manage.py runserver 8000 &
                    """
                }
            }
        }

        stage('Setup SendProduct Microservice') {
            steps {
                dir("${WORKSPACE_SEND}") {
                    sh """
                    echo Configurando o microserviço de envio de produtos...
                    python -m venv venv
                    source venv/bin/activate
                    pip install -r requirements.txt
                    nohup python manage.py runserver 8001 &
                    """
                }
            }
        }

        stage('Setup Main Microservice') {
            steps {
                dir("${WORKSPACE_MAIN}") {
                    sh """
                    echo Configurando o sistema de recebimento e armazenamento de produtos...
                    python -m venv venv
                    source venv/bin/activate
                    pip install -r requirements.txt
                    nohup python manage.py runserver 8002 &
                    """
                }
            }
        }

        stage('Setup Cards Microservice') {
            steps {
                dir("${WORKSPACE_CARDS}") {
                    sh """
                    echo Configurando o microserviço de cartões...
                    python -m venv venv
                    source venv/bin/activate
                    pip install -r requirements.txt
                    nohup python manage.py runserver 8003 &
                    """
                }
            }
        }
        /*
            stage('Run E2E Tests') {
                steps {
                    dir("${WORKSPACE_E2E}") {
                        sh """
                        echo Executando os testes E2E...
                        source ../venv/bin/activate
                        pytest
                        """
                    }
                }
            }
        }
        */
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
