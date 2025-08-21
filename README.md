E-commerce Micro Serviços (Django)
Pequeno e-commerce em micro serviços desenvolvido em Django que lista produtos, possui carrinho e pagamento. O frontend é servido pelos próprios templates do Django e a API expõe endpoints REST simples.
📦 Stack
Python 3.11+ (recomendado)
Django 5.x
Django REST Framework
SimpleJWT (auth via tokens, opcional)
django-cors-headers
SQLite (dev)
Static files servidos pelo Django em DEBUG=True
✅ Pré-requisitos
Python 3.11+
pip atualizado (python -m pip install --upgrade pip)
venv para isolar dependências
Recomendado o uso do MINGW64 para Windows
1) Subir o Frontend
O primeiro serviço que deve subir é o frontend.
Entrar na pasta frontend e iniciar o servidor web:
python -m http.server 5500
Conferir acessando o link: http://127.0.0.1:5500 (a pagina de login vai abrir)
2) Subir o serviço de Login (abra outro terminal MINGW64)
Entrar na pasta: cd micro_login
Criar ambiente virtual: python -m venv venv (aguarde finalizar)
Ativar o ambiente virtual: source venv/scripts/activate
Instalar as dependências: pip install -r requirements.txt (aguardar finalizar)
Subir o servidor: python manage.py runserver 8000 (vai rodar nessa porta)
3) Subir o serviço de envio de produtos (abra outro terminal MINGW64)
Entrar na pasta: cd micro_sendproduto
Criar ambiente virtual: python -m venv venv (aguarde finalizar)
Ativar o ambiente virtual: source venv/scripts/activate
Instalar as dependências: pip install -r requirements.txt (aguardar finalizar)
Subir o servidor: python manage.py runserver 8001 (vai rodar nessa porta)
4) Subir o serviço de recebimento de produtos (abra outro terminal MINGW64)
Entrar na pasta: cd sistema-main
Criar ambiente virtual: python -m venv venv (aguarde finalizar)
Ativar o ambiente virtual: source venv/scripts/activate
Instalar as dependências: pip install -r requirements.txt (aguardar finalizar)
Subir o servidor: python manage.py runserver 8002 (vai rodar nessa porta)
5) Subir o serviço de validação de cartões (abra outro terminal MINGW64)
Entrar na pasta: cd micro_pgt_cards
Criar ambiente virtual: python -m venv venv (aguarde finalizar)
Ativar o ambiente virtual: source venv/scripts/activate
Instalar as dependências: pip install -r requirements.txt (aguardar finalizar)
Subir o servidor: python manage.py runserver 8003 (vai rodar nessa porta)
6) Acessar o sistema
No link do frotend http://127.0.0.1:5500 acesse com as credenciais admin/admin
