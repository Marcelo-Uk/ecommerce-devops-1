from django.urls import path
from .views import send_product_page, handle_send_product

urlpatterns = [
    path('', send_product_page, name='send_product_page'),  # Página de envio de produtos
    path('api/send-product/', handle_send_product, name='handle_send_product'),  # Endpoint para enviar produtos via POST
]

