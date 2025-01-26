from django.contrib import admin
from .models import Produto

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('id', 'titulo', 'preco', 'saldo')  # Colunas exibidas na interface
