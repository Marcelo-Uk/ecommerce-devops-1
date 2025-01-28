# Use uma imagem base do Python
FROM python:3.11-slim

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo requirements.txt para o container
COPY requirements.txt .

# Instale as dependências do Python
RUN pip install --no-cache-dir -r requirements.txt

# Copie todo o código do microserviço para o container
COPY . .

# Exponha a porta que o Django usará
EXPOSE 8000

# Comando para rodar o Django quando o container iniciar
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]