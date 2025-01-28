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
                script {
                    // Variável para armazenar logs dos testes
                    def logs = ''

                    try {
                        logs += bat(script: 'docker exec micro_login_container python manage.py test auth_service', returnStdout: true)
                        logs += bat(script: 'docker exec micro_pgt_cards_container python manage.py test cards', returnStdout: true)
                        logs += bat(script: 'docker exec sistema_main_container python manage.py test produtos', returnStdout: true)
                        logs += bat(script: 'docker exec sendproduto_container python manage.py test sendproduct', returnStdout: true)
                    } catch (Exception e) {
                        // Se houver erro, salve os logs e continue
                        currentBuild.result = 'FAILURE'
                        error "Erro nos testes unitários:\n${logs}"
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

// Essa pipeline vai falhar caso algum teste falhe, facilitando a identificação através do email.