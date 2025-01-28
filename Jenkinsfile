pipeline {
    agent any

    stages {
        stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker-compose build'
            }
        }

        stage('Subir Containers') {
            steps {
                sh 'docker-compose up -d'
            }
        }
        /*
        stage('Testes Unitários') {
            steps {
                sh 'docker exec micro_login_container python manage.py test auth_service'
                sh 'docker exec micro_pgt_cards_container python manage.py test cards'
                sh 'docker exec sistema_main_container python manage.py test produtos'
                sh 'docker exec micro_sendproduto_container python manage.py test sendproduct'
            }
        }
        
        stage('Testes Integrados') {
            steps {
                sh 'docker exec sendoproduto_container pytest test_integration_sendprodutos.py'
            }
        }
        */

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
