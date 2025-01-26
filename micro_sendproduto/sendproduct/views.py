from django.shortcuts import render

def send_product_page(request):
    return render(request, 'sendproduct/sendprodutos.html')
