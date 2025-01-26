from django.urls import path
from .views import send_product_page

urlpatterns = [
    path('', send_product_page, name='send_product_page'),
]
