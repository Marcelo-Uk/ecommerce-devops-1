document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cardForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault(); // Impede o comportamento padrão do formulário

        const numeroCartao = document.getElementById("cardNumber").value.trim();
        const nomeCartao = document.getElementById("cardName").value.trim();
        const dataValidade = document.getElementById("cardExpiry").value.trim();
        const cvv = document.getElementById("cardCVV").value.trim();
        const tipoPagamento = document.querySelector('input[name="paymentType"]:checked').value;

        const valorPagamento = localStorage.getItem("totalValue");

        if (!valorPagamento) {
            alert("Erro: Valor total não encontrado. Volte à página de pagamento.");
            return;
        }

        const payload = {
            numero_cartao: numeroCartao,
            nome_cartao: nomeCartao,
            data_validade: dataValidade,
            cvv: cvv,
            tipo_pagamento: tipoPagamento,
            valor: parseFloat(valorPagamento), // Converte o valor para número
        };

        try {
            const response = await fetch("http://127.0.0.1:8003/api/cards/validar/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.mensagem); // Mostra a mensagem de sucesso

                if (result.mensagem.includes("Pagamento aprovado")) {
                    // Redireciona para a página produtos.html após sucesso
                    setTimeout(() => {
                        window.location.href = "products.html";
                    }, 2000); // Espera 2 segundos antes de redirecionar
                }
            } else {
                alert(`Erro: ${result.mensagem}`); // Mostra a mensagem de erro
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Ocorreu um erro ao processar o pagamento. Tente novamente mais tarde.");
        }
    });
});
