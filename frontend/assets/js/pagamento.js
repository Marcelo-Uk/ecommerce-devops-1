// Simulação de valor total vindo do carrinho (isso será substituído pelo backend/microserviço no futuro)
const totalValue = localStorage.getItem("totalValue") || "0.00";

// Atualiza o valor total na tela
document.addEventListener("DOMContentLoaded", () => {
    const totalValueElement = document.getElementById("total-value");
    totalValueElement.textContent = `Valor Total: R$ ${parseFloat(totalValue).toFixed(2)}`;
});

// Botão "Voltar para Produtos"
document.getElementById("btn-back-prod").addEventListener("click", () => {
    window.location.href = "products.html"; // Redireciona para a página de produtos
});

// Botão "Voltar para Carrinho"
document.getElementById("btn-back-cart").addEventListener("click", () => {
    window.location.href = "carrinho.html"; // Redireciona para a página do carrinho
});

// Botão "Pagar"
document.getElementById("btn-pay").addEventListener("click", () => {
    window.location.href = "cartoes.html"; // Redireciona para a página de pagamento com cartões
});


// Botões de navegação
document.getElementById("btn-back-prod").addEventListener("click", () => {
    window.location.href = "products.html"; // Redireciona para a página de produtos
});

document.getElementById("btn-back-cart").addEventListener("click", () => {
    window.location.href = "carrinho.html"; // Redireciona para a página do carrinho
});
