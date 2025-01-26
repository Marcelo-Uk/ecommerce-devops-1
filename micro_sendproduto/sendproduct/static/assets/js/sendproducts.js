document.getElementById("sendProductForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const produto = Object.fromEntries(formData);

    console.log("Preparando para enviar os seguintes dados:", produto);

    try {
        const endpoint = "http://127.0.0.1:8002/api/receber-produtos/";
        console.log(`Enviando dados para o endpoint: ${endpoint}`);

        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(produto),
        });

        if (response.ok) {
            console.log("Dados enviados com sucesso:", produto);
            alert("Produto enviado com sucesso!");
            event.target.reset();
        } else {
            throw new Error("Erro ao enviar produto. Verifique os dados e tente novamente.");
        }
    } catch (error) {
        console.error("Erro durante o envio:", error);
        alert(error.message);
    }
});

