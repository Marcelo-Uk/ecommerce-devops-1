# Usar a imagem base do Python
FROM python:3.11-slim

# Configurar o diretório de trabalho dentro do container
WORKDIR /app

# Copiar todos os arquivos do microserviço para o container
COPY . /app

# Instalar as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Expor a porta 8002
EXPOSE 8002

# Comando para rodar o servidor Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8002"]
