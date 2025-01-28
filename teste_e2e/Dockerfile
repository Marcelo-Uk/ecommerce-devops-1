# Usar uma imagem oficial do Selenium Standalone com Firefox
FROM selenium/standalone-firefox:latest

# Configurar o diretório de trabalho dentro do container
WORKDIR /app

# Trocar temporariamente para o usuário root
USER root

# Remover fontes duplicadas e instalar Python e venv
RUN apt-get update && \
    apt-get install -y python3 python3-venv && \
    apt-get clean

# Retornar para o usuário padrão para segurança
USER seluser

# Criar o ambiente virtual
RUN python3 -m venv /app/venv

# Ativar o ambiente virtual e instalar dependências
COPY requirements.txt /app/
RUN /app/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copiar os testes para o container
COPY . /app/

# Comando para rodar o teste E2E usando o ambiente virtual
CMD ["/app/venv/bin/python", "teste_e2e.py"]
