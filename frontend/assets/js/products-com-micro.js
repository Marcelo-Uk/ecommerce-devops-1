// Função para buscar os produtos do micro serviço
async function fetchProdutos() {
    try {
        const accessToken = localStorage.getItem("access_token");
        
        // Verifica se o usuário está autenticado
        if (!accessToken) {
            alert("Você não está autenticado. Redirecionando para a página de login.");
            window.location.href = "index.html";
            return;
        }

        // Faz a requisição ao micro serviço
        const response = await fetch('http://localhost:8001/api/produtos/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`, // Envia o token no cabeçalho
                'Content-Type': 'application/json'
            }
        });

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
        }

        // Converte a resposta para JSON
        const produtos = await response.json();
        console.log('Produtos recebidos:', produtos); // Para depuração

        // Renderiza os produtos na página
        renderizarProdutos(produtos);
    } catch (error) {
        console.error('Erro ao carregar os produtos:', error);
        alert('Não foi possível carregar os produtos. Tente novamente mais tarde.');
    }
}

// Função para renderizar produtos na página
function renderizarProdutos(produtos) {
    const productList = document.getElementById('productList');
    productList.innerHTML = ''; // Limpa a lista antes de renderizar

    produtos.forEach((produto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${produto.foto}" alt="${produto.titulo}">
            <h2>${produto.titulo}</h2>
            <p class="price">R$ ${produto.preco.toFixed(2)}</p>
            <p class="stock">Estoque: ${produto.estoque}</p>
            <p>${produto.descricao}</p>
            <button class="btn-add-to-cart" data-id="${produto.id}">Adicionar ao Carrinho</button>
        `;

        productList.appendChild(productCard);
    });

    // Adicionar eventos aos botões de "Adicionar ao Carrinho"
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            const productId = parseInt(event.target.getAttribute('data-id'), 10);
            const produto = produtos.find((item) => item.id === productId);
            if (produto) addToCart(produto);
        });
    });
}

// Função para obter o carrinho do localStorage
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

// Função para salvar o carrinho no localStorage
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Função para adicionar um produto ao carrinho
function addToCart(produto) {
    const cart = getCart();
    const existingProduct = cart.find((item) => item.id === produto.id);

    if (existingProduct) {
        if (existingProduct.quantidade < produto.estoque) {
            existingProduct.quantidade += 1;
        } else {
            alert('Quantidade máxima no estoque alcançada.');
        }
    } else {
        cart.push({ ...produto, quantidade: 1 });
    }

    saveCart(cart);

    console.log('Carrinho atualizado:', cart); // Verifica o estado atualizado do carrinho
    alert(`"${produto.titulo}" foi adicionado ao carrinho.`);
}

// Verificar autenticação e inicializar a página
document.addEventListener('DOMContentLoaded', () => {
    const accessToken = localStorage.getItem("access_token");

    // Verifica se o token de acesso existe
    if (!accessToken) {
        alert("Você não está autenticado. Redirecionando para a página de login.");
        window.location.href = "index.html";
        return;
    }

    // Se autenticado, renderiza os produtos
    renderizarProdutos();
});