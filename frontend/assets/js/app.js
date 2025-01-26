const API_BASE = "http://localhost:8000/api"; // Base URL para os endpoints

// Função para exibir o botão "Adicionar Produto" se for admin
async function showAdminFeatures() {
    const addProductButton = document.querySelector("#addProductButton");
    try {
        const response = await fetch(`${API_BASE}/auth/user/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("access_token")}` },
        });

        if (response.ok) {
            const user = await response.json();
            if (user.role === "admin") {
                addProductButton.style.display = "inline-block";
            }
        }
    } catch (error) {
        console.error("Erro ao verificar permissões do usuário:", error);
    }
}

// Função para abrir o formulário de adicionar produto
function openAddProductForm() {
    const formHTML = `
        <div id="productModal" class="modal">
            <div class="modal-content">
                <h2>Adicionar Produto</h2>
                <form id="addProductForm">
                    <label for="productName">Nome do Produto</label>
                    <input type="text" id="productName" required>
                    <label for="productDescription">Descrição</label>
                    <textarea id="productDescription" required></textarea>
                    <label for="productPrice">Preço</label>
                    <input type="number" id="productPrice" required step="0.01">
                    <button type="submit">Adicionar</button>
                    <button type="button" id="closeModal">Cancelar</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", formHTML);

    document.querySelector("#addProductForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        await addProduct();
        closeModal();
    });

    document.querySelector("#closeModal").addEventListener("click", closeModal);
}

// Função para adicionar produto ao backend
async function addProduct() {
    const name = document.querySelector("#productName").value;
    const description = document.querySelector("#productDescription").value;
    const price = document.querySelector("#productPrice").value;

    try {
        const response = await fetch(`${API_BASE}/products/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
            body: JSON.stringify({ name, description, price }),
        });

        if (response.ok) {
            alert("Produto adicionado com sucesso!");
            loadProducts(); // Atualiza a lista de produtos
        } else {
            const data = await response.json();
            alert(data.detail || "Erro ao adicionar produto.");
        }
    } catch (error) {
        console.error("Erro ao adicionar produto:", error);
        alert("Erro ao conectar ao servidor. Tente novamente.");
    }
}

// Função para fechar o modal
function closeModal() {
    const modal = document.querySelector("#productModal");
    if (modal) {
        modal.remove();
    }
}

// Event Listener para o botão "Adicionar Produto"
document.querySelector("#addProductButton")?.addEventListener("click", openAddProductForm);

// Carregar produtos automaticamente
if (window.location.pathname.endsWith("products.html")) {
    showAdminFeatures();
    loadProducts();
}
