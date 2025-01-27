// Função para carregar o carrinho do localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    console.log('Carrinho carregado do localStorage:', cart); // Log para depuração
    return cart ? JSON.parse(cart) : [];
}

// Atualizar o total do carrinho
function updateTotalPrice(cart) {
    const totalPrice = cart.reduce((total, item) => {
        const preco = parseFloat(item.preco); // Garante que o preço é numérico
        if (isNaN(preco)) {
            console.error(`Preço inválido encontrado para o item: ${item.titulo}`, item);
            return total; // Ignora itens com preços inválidos
        }
        return total + preco * item.quantidade;
    }, 0);

    // Atualiza o elemento na página
    document.getElementById('total-price').textContent = `Total: R$ ${totalPrice.toFixed(2)}`;

    // Salva o total no localStorage para ser usado na página de pagamento
    localStorage.setItem('totalValue', totalPrice.toFixed(2));
}

// Renderizar os itens no carrinho
function renderCartItems() {
    const cart = getCart();
    console.log('Produtos no carrinho (do localStorage):', cart); // Loga os produtos carregados

    const cartItemsContainer = document.getElementById('cart-items');

    if (!cartItemsContainer) {
        console.error('O elemento #cart-items não foi encontrado no DOM.');
        return;
    }

    cartItemsContainer.innerHTML = ''; // Limpa os itens renderizados previamente

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Seu carrinho está vazio!</p>';
    } else {
        cart.forEach((item) => {
            const preco = parseFloat(item.preco); // Converte o preço para número
            if (isNaN(preco)) {
                console.error(`Preço inválido encontrado para o item: ${item.titulo}`, item);
                return; // Ignora itens com preços inválidos
            }

            // Construindo o caminho completo da imagem
            const imgBasePath = "assets/imgs/"; // Caminho base para as imagens
            const imgSrc = `${imgBasePath}${item.foto}`; // Caminho completo para a imagem

            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${imgSrc}" alt="${item.titulo}" class="cart-item-img">
                <div class="cart-item-details">
                    <h3>${item.titulo}</h3>
                    <p>Preço: R$ ${preco.toFixed(2)}</p>
                    <p>Quantidade: ${item.quantidade}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="remove-item" data-id="${item.id}">Remover</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    updateTotalPrice(cart); // Atualiza o total do carrinho
}

// Remover item do carrinho
function removeItemFromCart(productId) {
    let cart = getCart();
    cart = cart.filter((item) => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCartItems();
}

// Limpar o carrinho
function clearCart() {
    localStorage.removeItem('cart');
    renderCartItems();
}

// Adicionar eventos aos botões
function setupEventListeners() {
    document.getElementById('clear-cart').addEventListener('click', clearCart);

    document.getElementById('cart-items').addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-item')) {
            const productId = parseInt(event.target.getAttribute('data-id'), 10);
            removeItemFromCart(productId);
        }
    });

    document.getElementById('checkout').addEventListener('click', () => {
        alert('Você será redirecionado para a página de Pagamento!');
        // Aqui você redireciona para a página de pagamento
        window.location.href = 'pagamento.html';
    });
}

// Inicializar a página do carrinho com verificação de autenticação
document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem("access_token");

    // Verifica se o token de acesso existe
    if (!accessToken) {
        alert("Você não está autenticado. Redirecionando para a página de login.");
        window.location.href = "index.html";
        return;
    }

    console.log('Iniciando o carregamento do carrinho...');
    renderCartItems(); // Tenta renderizar os itens
    setupEventListeners(); // Adiciona os eventos ao carrinho
});

export { renderCartItems };

