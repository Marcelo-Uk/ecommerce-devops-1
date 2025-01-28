pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker-compose build'
            }
        }

        stage('Subir Containers') {
            steps {
                bat 'docker-compose up -d'
            }
        }

        stage('Testes Unitários') {
            steps {
                bat 'docker exec micro_login_container python manage.py test auth_service'
                bat 'docker exec micro_pgt_cards_container python manage.py test cards'
                bat 'docker exec sistema_main_container python manage.py test produtos'
                bat 'docker exec micro_sendproduto_container python manage.py test sendproduct'
            }
        }

        stage('Testes Integrados') {
            steps {
                bat 'docker exec micro_sendproduto_container pytest test_integration_sendprodutos.py'
            }
        }
        
    }
    post {
        success {
            echo "Pipeline finalizado com sucesso!"
        }
        failure {
            echo "Pipeline falhou!"
        }
    }
}
