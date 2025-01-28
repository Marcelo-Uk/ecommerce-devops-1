from django.http import JsonResponse
from .models import Cartao
import json
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal

@csrf_exempt
def validar_cartao(request):
    if request.method == 'POST':
        try:
            dados = json.loads(request.body)

            numero = dados.get('numero_cartao')
            nome = dados.get('nome_cartao')
            validade = dados.get('data_validade')
            cvv = dados.get('cvv')
            tipo_pagamento = dados.get('tipo_pagamento')  # "debito" ou "credito"
            valor = Decimal(dados.get('valor'))  # Converte o valor para Decimal

            # Verifica se o cartão existe
            try:
                cartao = Cartao.objects.get(numero_cartao=numero, nome_cartao=nome, data_validade=validade, cvv=cvv)
            except Cartao.DoesNotExist:
                return JsonResponse({'status': 'erro', 'mensagem': 'Cartão inválido'}, status=200)

            # Verifica o saldo
            if tipo_pagamento == 'debito':
                if cartao.saldo_debito >= valor:
                    cartao.saldo_debito -= valor
                    cartao.save()
                    return JsonResponse({'status': 'sucesso', 'mensagem': 'Pagamento aprovado no débito'})
                else:
                    return JsonResponse({'status': 'erro', 'mensagem': 'Saldo insuficiente no débito'}, status=400)
            elif tipo_pagamento == 'credito':
                if cartao.saldo_credito >= valor:
                    cartao.saldo_credito -= valor
                    cartao.save()
                    return JsonResponse({'status': 'sucesso', 'mensagem': 'Pagamento aprovado no crédito'})
                else:
                    return JsonResponse({'status': 'erro', 'mensagem': 'Saldo insuficiente no crédito'}, status=400)
            else:
                return JsonResponse({'status': 'erro', 'mensagem': 'Tipo de pagamento inválido'}, status=400)

        except Exception as e:
            return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=500)
    return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)
