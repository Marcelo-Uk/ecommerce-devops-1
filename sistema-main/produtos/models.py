from django.db import models

class Produto(models.Model):
    id = models.BigIntegerField(primary_key=True)  # Assumindo que o 'id' é único e fornecido pelo micro serviço
    titulo = models.CharField(max_length=255)  # Título do produto
    descricao = models.TextField(blank=True, null=True)  # Descrição detalhada
    saldo = models.IntegerField()  # Quantidade em estoque
    preco = models.DecimalField(max_digits=10, decimal_places=2)  # Preço do produto
    foto = models.URLField()  # URL da imagem do produto

    def __str__(self):
        return self.titulo