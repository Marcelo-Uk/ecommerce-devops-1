pipeline {
    agent any

    environment {
        logs = '' // Inicializar variável de logs globalmente
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Clonando o repositório do GitHub..."
                checkout scm
            }
        }

        stage('Limpar Ambiente') {
            steps {
                echo "Limpando o ambiente: containers, imagens e redes antigas..."
                script {
                    // Remove todos os containers (parados ou em execução)
                    bat 'docker rm -f $(docker ps -aq) || echo "Nenhum container para remover"'

                    // Remove todas as imagens sem tag ou antigas
                    bat 'docker rmi -f $(docker images -aq) || echo "Nenhuma imagem para remover"'

                    // Remove todas as redes customizadas
                    bat 'docker network prune -f || echo "Nenhuma rede para remover"'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo "Construindo imagem do frontend..."
                    bat 'docker build -t frontend_image .'
                }
            }
        }

        stage('Build Micro Login') {
            steps {
                dir('micro_login') {
                    echo "Construindo imagem do micro_login..."
                    bat 'docker build -t micro_login_image .'
                }
            }
        }

        stage('Build Send Produto') {
            steps {
                dir('micro_sendproduto') {
                    echo "Construindo imagem do sendproduto..."
                    bat 'docker build -t sendproduto_image .'
                }
            }
        }

        stage('Build Sistema Main') {
            steps {
                dir('sistema-main') {
                    echo "Construindo imagem do sistema_main..."
                    bat 'docker build -t sistema_main_image .'
                }
            }
        }

        stage('Build Micro PGT Cards') {
            steps {
                dir('micro_pgt_cards') {
                    echo "Construindo imagem do micro_pgt_cards..."
                    bat 'docker build -t micro_pgt_cards_image .'
                }
            }
        }

        stage('Subir Containers') {
            steps {
                echo "Subindo os containers com docker-compose..."
                bat 'docker-compose up -d'
            }
        }

        stage('Verificar Containers') {
            steps {
                echo "Verificando os containers que estão rodando..."
                bat 'docker ps -a'
            }
        }
    }
}

/*
pipeline {
    agent any

    environment {
        logs = '' // Inicializar variável de logs globalmente
    }

    stages {
        stage('Checkout') {
            steps {
                echo "Clonando o repositório do GitHub..."
                checkout scm
            }
        }

        stage('Limpar Ambiente') {
            steps {
                script {
                    echo "Removendo todos os containers, imagens, redes e volumes..."
                    bat '''
                        for /f "tokens=*" %i in ('docker ps -q') do @docker stop %i
                        for /f "tokens=*" %i in ('docker ps -aq') do @docker rm %i
                        for /f "tokens=*" %i in ('docker images -q') do @docker rmi -f %i
                        docker network prune -f
                        docker volume prune -f
                    '''
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    echo "Construindo imagem do frontend..."
                    bat 'docker build -t frontend_image .'
                }
            }
        }

        stage('Build Micro Login') {
            steps {
                dir('micro_login') {
                    echo "Construindo imagem do micro_login..."
                    bat 'docker build -t micro_login_image .'
                }
            }
        }

        stage('Build Send Produto') {
            steps {
                dir('micro_sendproduto') {
                    echo "Construindo imagem do sendproduto..."
                    bat 'docker build -t sendproduto_image .'
                }
            }
        }

        stage('Build Sistema Main') {
            steps {
                dir('sistema-main') {
                    echo "Construindo imagem do sistema_main..."
                    bat 'docker build -t sistema_main_image .'
                }
            }
        }

        stage('Build Micro PGT Cards') {
            steps {
                dir('micro_pgt_cards') {
                    echo "Construindo imagem do micro_pgt_cards..."
                    bat 'docker build -t micro_pgt_cards_image .'
                }
            }
        }

        stage('Subir Containers') {
            steps {
                echo "Subindo os containers com docker-compose..."
                bat 'docker-compose up -d'
            }
        }

        stage('Verificar Containers') {
            steps {
                echo "Verificando os containers que estão rodando..."
                bat 'docker ps -a'
            }
        }

        stage('Testes Unitários') {
            steps {
                script {
                    try {
                        echo "=== Rodando testes para micro_login_container (auth_service) ==="
                        logs += "=== Rodando testes para micro_login_container (auth_service) ===\n"
                        logs += bat(script: 'docker exec micro_login_container python manage.py test', returnStdout: true)

                        echo "=== Rodando testes para micro_pgt_cards_container (cards) ==="
                        logs += "=== Rodando testes para micro_pgt_cards_container (cards) ===\n"
                        logs += bat(script: 'docker exec micro_pgt_cards_container python manage.py test', returnStdout: true)

                        echo "=== Rodando testes para sistema_main_container (produtos) ==="
                        logs += "=== Rodando testes para sistema_main_container (produtos) ===\n"
                        logs += bat(script: 'docker exec sistema_main_container python manage.py test', returnStdout: true)

                        echo "=== Rodando testes para sendproduto_container (sendproduct) ==="
                        logs += "=== Rodando testes para sendproduto_container (sendproduct) ===\n"
                        logs += bat(script: 'docker exec sendproduto_container python manage.py test', returnStdout: true)
                    } catch (Exception e) {
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
*/