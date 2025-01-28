# Usar a imagem base do Python
FROM python:3.11-slim

# Configurar o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos do microserviço para o container
COPY . /app

# Instalar as dependências do Django
RUN pip install --no-cache-dir -r requirements.txt

# Expor a porta 8001
EXPOSE 8001

# Rodar o servidor Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8001"]