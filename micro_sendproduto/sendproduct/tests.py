from django.test import TestCase
from django.urls import reverse

class SendProductViewTests(TestCase):
    def test_send_product_page_status_code(self):
        """Teste se a página /send-product/ retorna o status 200"""
        response = self.client.get(reverse('send_product_page'))
        self.assertEqual(response.status_code, 200)

    def test_send_product_page_usa_template_correto(self):
        """Teste se a página usa o template correto"""
        response = self.client.get(reverse('send_product_page'))
        self.assertTemplateUsed(response, 'sendproduct/sendprodutos.html')
