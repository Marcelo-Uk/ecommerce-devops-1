from django.shortcuts import render
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def send_product_page(request):
    return render(request, 'sendproduct/sendprodutos.html')

@csrf_exempt
def handle_send_product(request):
    if request.method == "POST":
        try:
            # Lê o corpo da requisição e tenta decodificar o JSON enviado
            data = json.loads(request.body)

            # Processa o produto (a lógica específica depende do que você quer fazer)
            print(f"Produto recebido: {data}")  # Apenas para logar no console por enquanto

            # Retorna uma resposta de sucesso
            return JsonResponse({"mensagem": "Produto enviado com sucesso!"}, status=200)
        except json.JSONDecodeError:
            # Erro se os dados enviados não forem um JSON válido
            return JsonResponse({"erro": "Dados inválidos enviados. Certifique-se de enviar um JSON válido."}, status=400)
    else:
        # Retorna erro se o método não for POST
        return JsonResponse({"erro": "Método não permitido."}, status=405)
