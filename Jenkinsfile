pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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
       
    }
    post {
        success {
            echo "Pipeline finalizado com sucesso!"
            emailext (
                subject: "Pipeline Sucesso: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "O pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} foi finalizado com sucesso.\n\nVeja os detalhes: ${env.BUILD_URL}",
                to: 'mribeirocorp@gmail.com'
            )
        }
        failure {
            echo "Pipeline falhou!"
            emailext (
                subject: "Pipeline Falhou: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: "O pipeline ${env.JOB_NAME} #${env.BUILD_NUMBER} falhou.\n\nVeja os detalhes do erro: ${env.BUILD_URL}",
                to: 'mribeirocorp@gmail.com'
            )
        }
    }
}
