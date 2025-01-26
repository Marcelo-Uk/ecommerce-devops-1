from django.contrib import admin
from .models import Cartao

@admin.register(Cartao)
class CartaoAdmin(admin.ModelAdmin):
    list_display = ('numero_cartao', 'nome_cartao', 'data_validade', 'saldo_debito', 'saldo_credito')
    search_fields = ('numero_cartao', 'nome_cartao')
