window.handleLogout = async function handleLogout() {
    const refreshToken = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token"); // Recupera o token de acesso
    if (!refreshToken) {
        alert("Nenhum token de refresh encontrado.");
        return;
    }

    try {
        const response = await fetch(`${window.API_BASE}/auth/logout/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}` // Adiciona o token de acesso no cabeçalho
            },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (response.ok) {
            // Remove os tokens do localStorage
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            alert("Logout realizado com sucesso.");

            // Redireciona para a página de login ou outra página apropriada
            window.location.href = "index.html";
        } else {
            const data = await response.json();
            alert(data.detail || "Erro ao realizar logout.");
        }
    } catch (error) {
        console.error("Erro ao realizar logout:", error);
        alert("Erro ao conectar ao servidor.");
    }
};


document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            handleLogout();
        });
    }
});
