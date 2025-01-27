from django.test import TestCase
from django.urls import reverse
from .models import Produto
from decimal import Decimal
import json

class ProdutoAPITests(TestCase):
    def setUp(self):
        # Produto de exemplo para os testes
        self.produto = Produto.objects.create(
            id=1,
            titulo="Produto Teste",
            descricao="Descrição do Produto Teste",
            saldo=10,
            preco=Decimal("99.99"),
            foto="produto-teste.png"
        )
        self.receber_produtos_url = reverse('receber_produtos')
        self.listar_produtos_api_url = reverse('listar_produtos_api')

    def test_receber_produtos_cria_produto(self):
        """Testa se o endpoint cria um novo produto"""
        novo_produto = {
            "id": 2,
            "titulo": "Novo Produto",
            "descricao": "Descrição do Novo Produto",
            "saldo": 5,
            "preco": "49.99",
            "foto": "novo-produto.png"
        }
        response = self.client.post(
            self.receber_produtos_url,
            data=json.dumps(novo_produto),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'sucesso')

        # Verifica se o produto foi salvo no banco
        produto_criado = Produto.objects.get(id=2)
        self.assertEqual(produto_criado.titulo, "Novo Produto")
        self.assertEqual(produto_criado.saldo, 5)
        self.assertEqual(produto_criado.preco, Decimal("49.99"))

    def test_receber_produtos_atualiza_produto(self):
        """Testa se o endpoint atualiza um produto existente"""
        dados_atualizados = {
            "id": 1,  # ID do produto já existente
            "titulo": "Produto Atualizado",
            "descricao": "Descrição Atualizada",
            "saldo": 20,
            "preco": "199.99",
            "foto": "produto-atualizado.png"
        }
        response = self.client.post(
            self.receber_produtos_url,
            data=json.dumps(dados_atualizados),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'sucesso')

        # Verifica se o produto foi atualizado no banco
        produto_atualizado = Produto.objects.get(id=1)
        self.assertEqual(produto_atualizado.titulo, "Produto Atualizado")
        self.assertEqual(produto_atualizado.saldo, 20)
        self.assertEqual(produto_atualizado.preco, Decimal("199.99"))

    def test_receber_produtos_dados_invalidos(self):
        """Testa se o endpoint retorna erro para dados inválidos"""
        dados_invalidos = {
            "id": 3,
            "titulo": "",  # Campo obrigatório ausente
            "descricao": "Produto com dados inválidos",
            "saldo": -5,  # Saldo inválido
            "preco": "invalid",  # Preço inválido
            "foto": "produto-invalido.png"
        }
        response = self.client.post(
            self.receber_produtos_url,
            data=json.dumps(dados_invalidos),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'erro')

    def test_receber_produtos_metodo_nao_permitido(self):
        """Testa se o endpoint retorna erro para método HTTP não permitido"""
        response = self.client.get(self.receber_produtos_url)
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['mensagem'], 'Método não permitido')

    def test_listar_produtos_api(self):
        """Testa se o endpoint lista os produtos do banco"""
        response = self.client.get(self.listar_produtos_api_url)
        self.assertEqual(response.status_code, 200)

        # Verifica se os dados retornados são os esperados
        produtos = response.json()
        self.assertEqual(len(produtos), 1)  # Apenas 1 produto no banco
        self.assertEqual(produtos[0]['id'], 1)
        self.assertEqual(produtos[0]['titulo'], "Produto Teste")
        self.assertEqual(produtos[0]['saldo'], 10)
        self.assertEqual(produtos[0]['preco'], "99.99")  # API retorna como string
