// Mock de métodos globais
global.fetch = jest.fn(); // Mock do fetch
global.alert = jest.fn(); // Mock do alert
console.error = jest.fn(); // Mock do console.error

// Importa as funções a serem testadas
import { fetchProdutos } from "../assets/js/products";

describe("Teste de carregamento de produtos", () => {
  beforeEach(() => {
    // Configura o DOM com o elemento onde os produtos serão renderizados
    document.body.innerHTML = `
      <div id="productList"></div>
    `;

    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it("Deve carregar e renderizar produtos corretamente", async () => {
    // Mock da resposta bem-sucedida do fetch
    const mockProdutos = [
      {
        id: 1,
        titulo: "Produto A",
        descricao: "Descrição do Produto A",
        saldo: 10,
        preco: 100.5,
        foto: "produtoA.jpg",
      },
      {
        id: 2,
        titulo: "Produto B",
        descricao: "Descrição do Produto B",
        saldo: 5,
        preco: 200.0,
        foto: "produtoB.jpg",
      },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockProdutos),
    });

    // Executa a função
    await fetchProdutos();

    // Verifica se o fetch foi chamado com a URL correta
    expect(fetch).toHaveBeenCalledWith("http://127.0.0.1:8002/api/produtos/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Verifica se os produtos foram renderizados no DOM
    const productList = document.getElementById("productList");
    expect(productList.children.length).toBe(2); // Deve ter 2 produtos renderizados

    // Verifica o conteúdo renderizado do primeiro produto
    const firstProduct = productList.children[0];
    expect(firstProduct.querySelector("h2").textContent).toBe("Produto A");
    expect(firstProduct.querySelector(".price").textContent).toBe("R$ 100.50");
    expect(firstProduct.querySelector("p.stock").textContent).toBe("Estoque: 10");
  });

  it("Deve exibir alerta e logar erro no console em caso de falha no fetch", async () => {
    // Mock da resposta com erro do fetch
    fetch.mockRejectedValueOnce(new Error("Erro ao carregar produtos"));

    // Executa a função
    await fetchProdutos();

    // Verifica se o alert foi chamado
    expect(alert).toHaveBeenCalledWith("Erro ao carregar produtos.");

    // Verifica se o erro foi logado no console
    expect(console.error).toHaveBeenCalledWith("Erro ao buscar produtos:", expect.any(Error));
  });
});
