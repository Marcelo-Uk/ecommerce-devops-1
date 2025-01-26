from django.db import models

class Cartao(models.Model):
    numero_cartao = models.CharField(max_length=16, unique=True)
    nome_cartao = models.CharField(max_length=100)
    data_validade = models.CharField(max_length=5)  # Formato MM/AA
    cvv = models.CharField(max_length=3)
    saldo_debito = models.DecimalField(max_digits=10, decimal_places=2)
    saldo_credito = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.numero_cartao} - {self.nome_cartao}"
