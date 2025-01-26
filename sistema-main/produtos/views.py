from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Produto

@csrf_exempt  # Desativa a proteção CSRF para aceitar requisições externas (cuidado em produção!)
def receber_produtos(request):
    if request.method == 'POST':
        try:
            # Parseia os dados recebidos como JSON
            dados = json.loads(request.body)

            # Processa e salva o produto no banco de dados
            Produto.objects.update_or_create(
                id=dados['id'],  # Atualiza ou cria baseado no ID do produto
                defaults={
                    'titulo': dados['titulo'],
                    'descricao': dados['descricao'],
                    'saldo': dados['saldo'],
                    'preco': dados['preco'],
                    'foto': dados['foto'],
                }
            )
            return JsonResponse({'status': 'sucesso', 'mensagem': 'Produto salvo com sucesso!'})
        except Exception as e:
            return JsonResponse({'status': 'erro', 'mensagem': str(e)}, status=400)
    else:
        return JsonResponse({'status': 'erro', 'mensagem': 'Método não permitido'}, status=405)

def listar_produtos_api(request):
    produtos = Produto.objects.all().values('id', 'titulo', 'descricao', 'saldo', 'preco', 'foto')  # Escolha os campos necessários
    return JsonResponse(list(produtos), safe=False)