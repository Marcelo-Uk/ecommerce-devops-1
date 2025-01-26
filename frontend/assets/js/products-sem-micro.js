
// Simulação de dados de produtos (posteriormente substituído por requisições)
const produtos = [
    {
        id: 1,
        titulo: 'Produto 1',
        preco: 50.00, // Armazenado como número para cálculos
        foto: './assets/imgs/gabinete-1.png',
        estoque: 10,
        descricao: 'Este é o produto 1, perfeito para suas necessidades.',
    },
    {
        id: 2,
        titulo: 'Produto 2',
        preco: 70.00,
        foto: './assets/imgs/vga-1.png',
        estoque: 5,
        descricao: 'Este é o produto 2, excelente qualidade.',
    },
    {
        id: 3,
        titulo: 'Produto 3',
        preco: 90.00,
        foto: './assets/imgs/cooler-1.png',
        estoque: 12,
        descricao: 'Este é o produto 1, perfeito para suas necessidades.',
    },
    {
        id: 4,
        titulo: 'Produto 4',
        preco: 100.00,
        foto: './assets/imgs/fonte-1.png',
        estoque: 5,
        descricao: 'Este é o produto 2, excelente qualidade.',
    },
];

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
    alert("${produto.titulo}" foi adicionado ao carrinho.);
}

// Função para renderizar produtos na página
function renderizarProdutos() {
    const productList = document.getElementById('productList');
    produtos.forEach((produto) => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = 
            <img src="${produto.foto}" alt="${produto.titulo}">
            <h2>${produto.titulo}</h2>
            <p class="price">R$ ${produto.preco.toFixed(2)}</p>
            <p class="stock">Estoque: ${produto.estoque}</p>
            <p>${produto.descricao}</p>
            <button class="btn-add-to-cart" data-id="${produto.id}">Adicionar ao Carrinho</button>
        ;

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