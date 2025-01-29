from django.test import TestCase
from django.urls import reverse
from decimal import Decimal
from .models import Cartao

class ValidarCartaoTests(TestCase):
    def setUp(self):
        # Cria um cartão para os testes
        self.cartao = Cartao.objects.create(
            numero_cartao="1234567812345678",
            nome_cartao="Fulano de Tal",
            data_validade="12/27",
            cvv="123",
            saldo_debito=Decimal("100.00"),
            saldo_credito=Decimal("200.00")
        )
        self.validar_url = reverse('validar_cartao')  # Certifique-se que a URL está configurada com este name

    def test_cartao_valido_debito_suficiente(self):
        """Testa pagamento no débito com saldo suficiente"""
        response = self.client.post(self.validar_url, {
            "numero_cartao": self.cartao.numero_cartao,
            "nome_cartao": self.cartao.nome_cartao,
            "data_validade": self.cartao.data_validade,
            "cvv": self.cartao.cvv,
            "tipo_pagamento": "debito",
            "valor": "50.00"
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['status'], 'sucesso')
        self.assertEqual(response.json()['mensagem'], 'Pagamento aprovado no débito')

    def test_cartao_valido_credito_suficiente(self):
        """Testa pagamento no crédito com saldo suficiente"""
        response = self.client.post(self.validar_url, {
            "numero_cartao": self.cartao.numero_cartao,
            "nome_cartao": self.cartao.nome_cartao,
            "data_validade": self.cartao.data_validade,
            "cvv": self.cartao.cvv,
            "tipo_pagamento": "credito",
            "valor": "150.00"
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'sucesso')
        self.assertEqual(response.json()['mensagem'], 'Pagamento aprovado no crédito')

    def test_cartao_valido_debito_insuficiente(self):
        """Testa pagamento no débito com saldo insuficiente"""
        response = self.client.post(self.validar_url, {
            "numero_cartao": self.cartao.numero_cartao,
            "nome_cartao": self.cartao.nome_cartao,
            "data_validade": self.cartao.data_validade,
            "cvv": self.cartao.cvv,
            "tipo_pagamento": "debito",
            "valor": "150.00"
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['status'], 'erro')
        self.assertEqual(response.json()['mensagem'], 'Saldo insuficiente no débito')

    def test_cartao_inexistente(self):
        """Testa requisição com um cartão inexistente"""
        response = self.client.post(self.validar_url, {
            "numero_cartao": "9999999999999999",
            "nome_cartao": "Não Existe",
            "data_validade": "01/30",
            "cvv": "999",
            "tipo_pagamento": "debito",
            "valor": "50.00"
        }, content_type='application/json')
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'erro')
        self.assertEqual(response.json()['mensagem'], 'Cartão inválido')

    def test_metodo_nao_permitido(self):
        """Testa envio de requisição com método diferente de POST"""
        response = self.client.get(self.validar_url)  # Método GET
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json()['mensagem'], 'Método não permitido')
