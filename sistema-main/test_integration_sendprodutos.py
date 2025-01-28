import pytest
import requests

# URL dos microserviços
SEND_PRODUTOS_URL = "http://micro_sendproduto:8001/api/send-product/"
RECEBER_PRODUTOS_URL = "http://sistema_main:8002/api/receber-produtos/"
LISTAR_PRODUTOS_URL = "http://sistema_main:8002/api/produtos/"

@pytest.fixture
def produto_valido():
    return {
        "id": 1,
        "titulo": "Produto de Teste",
        "descricao": "Descrição do Produto",
        "saldo": 10,
        "preco": 99.99,
        "foto": "produto.jpg",
    }

def test_integração_envio_recebimento_produtos(produto_valido):
    """
    Teste de integração: Envio de produto do micro_sendprodutos
    e armazenamento no sistema_main.
    """
    # 1. Simula o envio do produto pelo micro_sendprodutos
    response_envio = requests.post(SEND_PRODUTOS_URL, json=produto_valido)

    print(f"Status Code: {response_envio.status_code}")
    print(f"Response Body: {response_envio.text}")

    # Verifica se o envio foi bem-sucedido
    assert response_envio.status_code == 200
    assert response_envio.json()["mensagem"] == "Produto enviado com sucesso!"

    # 2. Verifica se o produto foi armazenado no sistema_main
    response_recebimento = requests.post(RECEBER_PRODUTOS_URL, json=produto_valido)

    # Verifica se o produto foi recebido e salvo com sucesso
    assert response_recebimento.status_code == 200
    assert response_recebimento.json()["mensagem"] == "Produto salvo com sucesso!"

    # 3. Confirma se o produto aparece na listagem de produtos
    response_listagem = requests.get(LISTAR_PRODUTOS_URL)
    assert response_listagem.status_code == 200

    # Verifica se o produto está presente na lista
    produtos = response_listagem.json()
    assert any(p["id"] == produto_valido["id"] for p in produtos)
