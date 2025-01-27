export async function fetchProdutos() {
    const apiURL = "http://127.0.0.1:8002/api/produtos/";

    try {
        const response = await fetch(apiURL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Erro ao carregar produtos.");
        }

        const produtos = await response.json();
        renderizarProdutos(produtos);
    } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        alert("Erro ao carregar produtos.");
    }
}

function renderizarProdutos(produtos) {
    const productList = document.getElementById("productList");
    productList.innerHTML = ""; // Limpa a lista antes de renderizar

    produtos.forEach((produto) => {
        const preco = parseFloat(produto.preco); // Converte o preço para número, caso esteja em string

        if (isNaN(preco)) {
            console.error(`O produto ${produto.titulo} tem um preço inválido:`, produto.preco);
            return; // Ignora produtos com preços inválidos
        }

        // Construindo o caminho completo da imagem
        const imgBasePath = "assets/imgs/"; // Caminho base para as imagens
        const imgSrc = `${imgBasePath}${produto.foto}`; // Caminho completo para a imagem

        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
            <img src="${imgSrc}" alt="${produto.titulo}">
            <h2>${produto.titulo}</h2>
            <p class="price">R$ ${preco.toFixed(2)}</p>
            <p class="stock">Estoque: ${produto.saldo}</p>
            <p>${produto.descricao}</p>
            <button class="btn-add-to-cart" data-id="${produto.id}">Adicionar ao Carrinho</button>
        `;

        productList.appendChild(productCard);
    });

    // Adicionar eventos aos botões de "Adicionar ao Carrinho"
    const addToCartButtons = document.querySelectorAll(".btn-add-to-cart");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const productId = parseInt(event.target.getAttribute("data-id"), 10);
            const produto = produtos.find((item) => item.id === productId);
            if (produto) addToCart(produto);
        });
    });
}

function addToCart(produto) {
    const cart = getCart();
    const existingProduct = cart.find((item) => item.id === produto.id);

    if (existingProduct) {
        if (existingProduct.quantidade < produto.saldo) {
            existingProduct.quantidade += 1;
        } else {
            alert("Quantidade máxima no estoque alcançada.");
            return;
        }
    } else {
        cart.push({
            id: produto.id,
            titulo: produto.titulo,
            descricao: produto.descricao,
            preco: produto.preco,
            foto: produto.foto,
            quantidade: 1,
        });
    }

    saveCart(cart);

    console.log("Carrinho atualizado:", cart);
    alert(`"${produto.titulo}" foi adicionado ao carrinho.`);
}

function getCart() {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

document.addEventListener("DOMContentLoaded", () => {
    fetchProdutos();
});
