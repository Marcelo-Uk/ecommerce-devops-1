from django.urls import path
from .views import receber_produtos
from .views import listar_produtos_api

urlpatterns = [
    path('api/receber-produtos/', receber_produtos, name='receber_produtos'),
    path('api/produtos/', listar_produtos_api, name='listar_produtos_api'),
]
