# Usar a imagem base do Python
FROM python:3.11-slim

# Configurar o diretório de trabalho no container
WORKDIR /app

# Copiar os arquivos do frontend para o container
COPY . /app

# Expor a porta 5500 (servidor HTTP)
EXPOSE 5500

# Rodar o servidor HTTP
CMD ["python", "-m", "http.server", "5500"]
