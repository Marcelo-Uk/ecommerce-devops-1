from django.contrib.auth.models import User
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken

class AuthServiceTests(APITestCase):
    def setUp(self):
        # Cria um usuário para os testes
        self.user = User.objects.create_user(
            username="testuser",
            password="password123"
        )
        self.login_url = "/api/auth/login/"
        self.logout_url = "/api/auth/logout/"

    #Envia uma requisição POST para /api/auth/login/ com credenciais válidas.
    #Verifica se:
    #O status da resposta é 200 OK.
    #O JSON de resposta contém os tokens access e refresh.
    #O token de acesso contém os dados corretos do usuário.
    def test_login_com_sucesso(self): # ^ ^ ^
        """Teste de login com credenciais corretas"""
        response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "password123"
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)  # Token de acesso está presente
        self.assertIn("refresh", response.data)  # Token de refresh está presente

        # Decodifica o token de acesso (usando AccessToken)
        decoded_access = AccessToken(response.data["access"])
        self.assertEqual(decoded_access["username"], "testuser")
        self.assertEqual(decoded_access["user_id"], self.user.id)

    #Verifica se:
    #O status da resposta é 401 Unauthorized.
    #O JSON contém uma mensagem de erro (detail).
    def test_login_com_credenciais_invalidas(self):
        """Teste de login com credenciais incorretas"""
        response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "wrongpassword"
        })

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("detail", response.data)  # Verifica mensagem de erro

    def test_logout_com_sucesso(self):
        """Teste de logout com token válido"""
        # Faz login e pega o token de refresh
        login_response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "password123"
        })
        refresh_token = login_response.data["refresh"]
        access_token = login_response.data["access"]

        # Envia requisição de logout com autenticação
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = self.client.post(self.logout_url, {
            "refresh_token": refresh_token
        })

        self.assertEqual(logout_response.status_code, status.HTTP_200_OK)
        self.assertEqual(logout_response.data["detail"], "Logout realizado com sucesso.")

    def test_logout_sem_token(self):
        """Teste de logout sem enviar o token de refresh"""
        # Faz login para autenticação
        login_response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "password123"
        })
        access_token = login_response.data["access"]

        # Envia requisição de logout sem refresh_token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = self.client.post(self.logout_url, {})

        self.assertEqual(logout_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(logout_response.data["detail"], "Token de refresh não fornecido.")

    def test_logout_com_token_invalido(self):
        """Teste de logout com token inválido"""
        # Faz login para autenticação
        login_response = self.client.post(self.login_url, {
            "username": "testuser",
            "password": "password123"
        })
        access_token = login_response.data["access"]

        # Envia requisição de logout com um token inválido
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        invalid_token = "token_invalido_123"
        logout_response = self.client.post(self.logout_url, {
            "refresh_token": invalid_token
        })

        self.assertEqual(logout_response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
        self.assertEqual(logout_response.data["detail"], "Erro ao realizar logout.")
