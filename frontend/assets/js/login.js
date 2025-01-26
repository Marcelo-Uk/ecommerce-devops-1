const API_BASE = "http://localhost:8000/api"; // Base URL para os endpoints

// Função para realizar o login
async function handleLogin(event) {
    event.preventDefault();

    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();
    const loginMessage = document.querySelector("#loginMessage");

    // Limpa mensagens anteriores
    loginMessage.textContent = "";
    loginMessage.style.display = "none";

    try {
        const response = await fetch(`${API_BASE}/auth/login/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Salva os tokens no localStorage
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);

            // Redireciona para a página de produtos
            window.location.href = "products.html";
        } else {
            // Exibe mensagem de erro retornada pelo servidor
            loginMessage.textContent = data.detail || "Credenciais inválidas. Tente novamente.";
            loginMessage.style.display = "block";
        }
    } catch (error) {
        console.error("Erro ao realizar login:", error);
        loginMessage.textContent = "Erro ao conectar ao servidor. Tente novamente.";
        loginMessage.style.display = "block";
    }
}

// Adiciona o event listener ao formulário de login
document.querySelector("#loginForm").addEventListener("submit", handleLogin);