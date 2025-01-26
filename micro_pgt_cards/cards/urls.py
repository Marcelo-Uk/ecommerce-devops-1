from django.urls import path
from .views import validar_cartao

urlpatterns = [
    path('validar/', validar_cartao, name='validar_cartao'),
]
